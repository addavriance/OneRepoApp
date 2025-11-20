import {BaseService} from "./base.service";
import {
    IPostActions,
    PostBase,
    PostData,
    PostListResult,
    Result,
    PostCreateResult,
    PostGetResult
} from "../../shared/interfaces";
import {IPost, IUser, Post} from "../db";
import {hasFlag, SortType} from "../../shared/flags";
import {Schema} from "mongoose";

export class PostService extends BaseService implements IPostActions {
    constructor(private currentUser: IUser) {
        super(currentUser);
    }

    private async getNextPostId(authorId: Schema.Types.ObjectId): Promise<number> {
        const lastPost = await Post.findOne({ author: authorId })
            .sort({ id: -1 })
            .select('id')
            .lean() as PostBase;

        return lastPost ? lastPost.id + 1 : 1;
    }

    async createPost(title: string, desc: string): Promise<PostCreateResult> {
        const author = this.currentUser._id as Schema.Types.ObjectId;
        const newId = await this.getNextPostId(author);

        await Post.create({
            id: newId,
            title,
            desc,
            author: author
        })

        return {
            error: false,
            code: 201,
            data: {
                id: newId
            }
        }
    }

    async getPost(postId: number): Promise<PostGetResult> {
        const result = await Post.findOneAndDelete({
            id: postId
        }) as IPost;

        if (!result) {
            return {
                error: true,
                messages: { post: "Post not found or you don't have permission to delete it" },
                code: 404
            };
        }

        return {
            error: false,
            code: 200,
            data: {
                id: result.id ,
                title: result.title,
                author: result.author,
                desc: result.desc,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
            } as PostData
        };
    }

    async deletePost(postId: number, userId?: Schema.Types.ObjectId): Promise<Result> {
        if (!userId && !this.currentUser) {
            return {
                error: true,
                messages: { userId: "Missing userId" },
                code: 401,
            };
        }

        if (!userId) {
            userId = this.currentUser._id as Schema.Types.ObjectId;
        }

        const result = await Post.findOneAndDelete({
            id: postId,
            author: userId
        });

        if (!result) {
            return {
                error: true,
                messages: { post: "Post not found or you don't have permission to delete it" },
                code: 404
            };
        }

        return {
            error: false,
            messages: { success: "Post deleted successfully" },
            code: 200
        };
    }

    async getPosts(offset: number, count: number, sortBy: number): Promise<PostListResult> {
        const createdAt = hasFlag(sortBy, SortType.CreatedDate) ? 1 : -1;
        const updatedAt = hasFlag(sortBy, SortType.UpdatedDate) ? 1 : -1;

        const result = await Post.find().sort({createdAt, updatedAt}).skip(offset).limit(count).exec() as IPost[];

        const postsData: PostData[] = result.map((postRaw) => {
            return {
                id: postRaw.id ,
                title: postRaw.title,
                author: postRaw.author,
                desc: postRaw.desc,
                createdAt: postRaw.createdAt,
                updatedAt: postRaw.updatedAt
            } as PostData;
        });

        return {
            error: false,
            code: 200,
            data: postsData,
        };
    }
}
