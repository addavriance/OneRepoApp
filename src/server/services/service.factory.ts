import {Request} from 'express'
import {UserService} from "./user.service";
import {PostService} from "./post.service";
import {TodoService} from "./todo.service";

export class ServiceFactory {
    static createUserService(req: Request): UserService {
        return new UserService(req.user!);
    }

    static createPostService(req: Request): PostService {
        return new PostService(req.user!);
    }

    static createTodoService(req: Request): TodoService {
        return new TodoService(req.user!);
    }
}
