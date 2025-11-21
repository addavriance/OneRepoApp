import {Schema} from "mongoose";

export interface PostBase<ID = string> {
    author: ID
    id: number;
    title: string;
    desc: string;
}

export interface UserBase {
    email: string;
    username: string;
    avatar_url?: string;
}

export interface AuthData {
    authToken: string;
}

export type PostData = PostBase & {createdAt: number, updatedAt: number};
export type PostDataUserBased = PostBase<Partial<UserBase>> & {createdAt: number, updatedAt: number};

export interface PostCreateData {
    id: number
}

export interface Result<T = object> {
    error?: boolean;
    messages?: {[key: string]: string};
    code: number;
    data?: T;
}

export type AuthResult = Result<AuthData>;

export type UserResult = Result<UserBase>;

export type PostCreateResult = Result<PostCreateData>

export type PostGetResult = Result<PostDataUserBased>

export type PostListResult = Result<PostDataUserBased[]>;

export interface IAuthActions {
    login(username: string, password: string): Promise<AuthResult>;
    register(username: string, email: string, password: string): Promise<Result>;
}

export interface IUserActions {
    getUser(token: string): Promise<UserResult>;
    saveUser(userData: UserBase): Promise<Result>;
}

export interface IPostActions {
    createPost(title: string, desc: string): Promise<PostCreateResult>;
    getPost(postId: number): Promise<PostGetResult>;
    deletePost(postId: number, userId?: Schema.Types.ObjectId): Promise<Result>;
    getPosts(offset: number, count: number, sortBy: number): Promise<PostListResult>;
}

export interface APIActions extends IAuthActions, IPostActions, IUserActions {}
