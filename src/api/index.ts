import {IActions, IAuthResult, IPost, IResult} from "../shared/interfaces";

export class API implements IActions {
    readonly base_url = "...";
    constructor() {

    }

    login(username: string, password: string): Promise<IAuthResult> {
        return Promise.resolve({});
    }

    createPost(title: string, desc: string): Promise<IResult> {
        return Promise.resolve({});
    }

    deletePost(id: number): Promise<IResult> {
        return Promise.resolve({});
    }

    getPosts(offset: number, count: number): Promise<IPost[]> {
        return Promise.resolve([]);
    }

    register(username: string, email: string, password: string): Promise<IResult> {
        return Promise.resolve({});
    }
}
