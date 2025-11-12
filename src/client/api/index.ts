import { APIActions, AuthResult, Post, Result, User } from "../../shared/interfaces";

export class API implements APIActions {
    readonly base_url = "...";
    constructor() {

    }

    login(username: string, password: string): Promise<AuthResult | Result> {
        return Promise.resolve({});
    }


    register(username: string, email: string, password: string): Promise<Result> {
        return Promise.resolve({});
    }

    user(token: string): Promise<User> {
        return Promise.resolve({});
    }

    createPost(title: string, desc: string): Promise<Result> {
        return Promise.resolve({});
    }

    deletePost(id: number): Promise<Result> {
        return Promise.resolve({});
    }

    getPosts(offset: number, count: number): Promise<Post[]> {
        return Promise.resolve([]);
    }
}
