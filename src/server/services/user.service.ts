import { BaseService, ServiceError } from "./base.service";
import { Request } from 'express'
import {IUserActions, Result, UserBase, UserResult} from "../../shared/interfaces";
import bcrypt from "bcryptjs";
import { IUser, User } from "../db";

export class UserService extends BaseService implements IUserActions {

    async createUser(userData: {
        email: string;
        password: string;
        username: string;
    }): Promise<Result & { user?: IUser }> {
        return this.executeService(async () => {
            await User.validate({...userData}); // NOTE 2: Лан добавил валидацию теперь почти норм

            // NOTE 1: На самом деле это решение оч странное, но пофиг
            // Хешировать пароль перед валидацией нет смысла если валидация не будет пройдена
            // По факту мы тратим время на хеширование для потенциально мусорного запроса
            const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 12): null;

            const user: IUser = await User.create({
                ...userData,
                password: hashedPassword
            });

            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password;

            return { user: userWithoutPassword };
        });
    }

    async findUserByEmail(email: string): Promise<Result & { user?: IUser }> {
        return this.executeService(async () => {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                throw new ServiceError('User not found', 404);
            }
            return { user };
        });
    }

    async findUserById(id: string): Promise<Result & { user?: IUser }> {
        return this.executeService(async () => {
            const user = await User.findById(id).select('-password');
            if (!user) {
                throw new ServiceError('User not found', 404);
            }
            return { user };
        });
    }

    async validateCredentials(username: string, password: string): Promise<Result & { user?: IUser }> {
        return this.executeService(async () => {
            const user = await User.findOne({ username }).exec() as IUser | null;

            if (!user) {
                throw new ServiceError('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new ServiceError('Invalid credentials');
            }

            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password;

            return { user: userWithoutPassword };
        });
    }

    getUser(): Promise<UserResult> {
        return Promise.resolve({}); // заглушка
    }

    saveUser(userData: UserBase, req?: Request): Promise<Result> {
        return this.executeService(async () => {
            await User.validate({...userData}, {pathsToSkip: 'password'});

            if (req) {
                const user = req.user!;

                user.username = userData.username;
                user.email = userData.email;
                user.avatar_url = userData.avatar_url || "";

                await user.save();
            }

            return {};
        });
    }
}
