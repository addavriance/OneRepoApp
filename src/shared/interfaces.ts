export interface UserBase {
    username: string,
}

export interface User extends UserBase {
    email: string;
}

export interface Post {
    id: number;
    title: string;
    desc: string;
    author: UserBase;
}

export interface Result {
    error?: boolean;
    messages: {[key: string]: string};
    code: number;
}

export interface AuthResult extends Result {
    authToken: string;
}

export interface IAuthActions {
    login(username: string, password: string): Promise<AuthResult | Result>;
    register(username: string, email: string, password: string): Promise<Result>;

    user(token: string): Promise<User>;
}

export interface IPostActions {
    createPost(title: string, desc: string): Promise<Result>;
    deletePost(id: number): Promise<Result>;
    getPosts(offset: number, count: number): Promise<Post[]>;
}

export interface APIActions extends IAuthActions, IPostActions {}
