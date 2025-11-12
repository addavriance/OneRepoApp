import jwt from "jsonwebtoken";
import {UserService} from "./user.service";
import {AuthResult, IAuthActions, Result, User} from "../../shared/interfaces";

export class AuthService implements IAuthActions {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async login(username: string, password: string): Promise<AuthResult | Result> {
        const result = await this.userService.validateCredentials(username, password);

        if (result.error || !result.user) {
            return {
                error: true,
                messages: result.messages,
                code: result.code
            };
        }

        const token = jwt.sign(
            { userId: result.user._id, email: result.user.email },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );

        return {
            error: false,
            messages: { success: "Login successful" },
            code: 200,
            authToken: token
        };
    }

    async register(username: string, email: string, password: string): Promise<Result> {
        const result = await this.userService.createUser({
            username,
            email,
            password
        });

        if (result.error) {
            return {
                error: true,
                messages: result.messages,
                code: result.code
            };
        }

        return {
            error: false,
            messages: { success: "User registered successfully" },
            code: 201
        };
    }

    async user(token: string): Promise<User> { }
}
