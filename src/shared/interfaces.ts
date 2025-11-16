export interface PostBase<ID = string> {
    author: ID
    id: number;
    title: string;
    desc: string;
}

export interface UserBase {
    email: string;
    username: string;
    posts: PostBase[];
    avatar_url?: string;
}

export interface AuthData {
    authToken: string;
}

export interface Result<T = object> {
    error?: boolean;
    messages: {[key: string]: string};
    code: number;
    data?: T;
}

export type AuthResult = Result<AuthData>;

export type UserResult = Result<UserBase>;

export type PostsResult = Result<(PostBase & {created: number, updated: number})[]>;

export interface IAuthActions {
    login(username: string, password: string): Promise<AuthResult>;
    register(username: string, email: string, password: string): Promise<Result>;
}

export interface IUserActions {
    getUser(token: string): Promise<UserResult>;
    saveUser(userData: UserBase): Promise<Result>;
}

export interface IPostActions {
    createPost(title: string, desc: string): Promise<Result>;
    deletePost(id: number): Promise<Result>;
    getPosts(offset: number, count: number): Promise<PostsResult>;
}

export interface APIActions extends IAuthActions, IPostActions, IUserActions {}
