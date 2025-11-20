import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

import {APIActions, AuthResult, PostListResult, Result, UserBase, UserResult} from "../../shared/interfaces";

export class API implements APIActions {
    private apiClient: AxiosInstance;

    constructor() {
        const config: AxiosRequestConfig = {
            baseURL: 'https://api.example.com',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        this.apiClient = axios.create(config);
    }

    login(username: string, password: string): Promise<AuthResult | Result> {
        return this.apiClient.post('/login', {
            username,
            password
        });
    }


    register(username: string, email: string, password: string): Promise<Result> {
        return this.apiClient.post('/register', {
            username,
            email,
            password
        })
    }

    getUser(token: string): Promise<UserResult> {
        return Promise.resolve({});
    }

    saveUser(userData: UserBase): Promise<Result> {
        return Promise.resolve({});
    }

    createPost(title: string, desc: string): Promise<Result> {
        return Promise.resolve({});
    }

    deletePost(id: number): Promise<Result> {
        return Promise.resolve({});
    }

    getPosts(offset: number, count: number): Promise<PostListResult> {
        return Promise.resolve({});
    }
}
