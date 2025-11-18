import {BaseService} from "./base.service";
import {IPostActions, PostsResult, Result} from "../../shared/interfaces";

export class PostService extends BaseService implements IPostActions {
    createPost(title: string, desc: string): Promise<Result> {
        return Promise.resolve({});
    }

    deletePost(id: number): Promise<Result> {
        return Promise.resolve({});
    }

    getPosts(offset: number, count: number): Promise<PostsResult> {
        return Promise.resolve({});
    }

}
