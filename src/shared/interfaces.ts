import {Schema} from "mongoose";

export interface Timestamp {
    createdAt: Date;
    updatedAt: Date;
}

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

export interface TodoBase {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    due_date?: string;
    reminder_time?: string;
}

export interface AuthData {authToken: string}

export interface PostData extends PostBase, Timestamp {}
export interface PostDataUserBased extends PostBase<Partial<UserBase>>, Timestamp {}
export interface PostCreateData {id: number}

export interface TodoData extends TodoBase, Timestamp {};
export interface TodoCreateData {
    title: string;
    description?: string;
    due_date?: Date;
    reminder_time?: Date;
}
export type TodoUpdateData = TodoCreateData & {completed?: boolean}


export interface Result<T = object> {
    error?: boolean;
    messages?: {[key: string]: string};
    code: number;
    data?: T;
}

export type AuthResult = Result<AuthData>;

export type UserResult = Result<UserBase>;

export type PostCreateResult = Result<PostCreateData>;

export type PostGetResult = Result<PostDataUserBased>;

export type PostListResult = Result<PostDataUserBased[]>;

export type TodoListResult = Result<TodoBase[]>;

export type TodoCreateResult = Result<TodoBase>;

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

export interface ITodoActions {
    createTodo(data: TodoCreateData): Promise<TodoCreateResult>;
    getTodos(): Promise<TodoListResult>;
    deleteTodo(id: number): Promise<TodoCreateResult>;
    toggleTodo(id: number): Promise<TodoCreateResult>;
}

export interface APIActions extends IAuthActions, IPostActions, IUserActions, ITodoActions {}
