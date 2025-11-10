export interface IAuthor {
    id: number;
    username?: string;
    avatar_url: string;
}

export interface IPost {
    id: number;
    title: string;
    desc: string;
    author: IAuthor;
}

export interface IResult {
    error?: boolean;
    messages: {[key: string]: string};
    code: number;
}

export interface IAuthResult extends IResult {
    authToken: string;
}

export interface IActions {
    login(username: string, password: string): Promise<IAuthResult>;
    register(username: string, email: string, password: string): Promise<IResult>;

    createPost(title: string, desc: string): Promise<IResult>;
    deletePost(id: number): Promise<IResult>;
    getPosts(offset: number, count: number): Promise<IPost[]>;
}
