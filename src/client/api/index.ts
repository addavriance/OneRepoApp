import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {
    APIActions,
    AuthResult,
    PostCreateResult,
    PostGetResult,
    PostListResult,
    Result,
    UserBase,
    UserResult
} from "../../shared/interfaces";

export class API implements APIActions {
    private apiClient: AxiosInstance;

    constructor() {
        const config: AxiosRequestConfig = {
            baseURL: '/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        }
        this.apiClient = axios.create(config);

        // Interceptor для добавления токена к каждому запросу
        this.apiClient.interceptors.request.use((config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    async login(username: string, password: string): Promise<AuthResult> {
        const response = await this.apiClient.post<AuthResult>('/auth/login', {
            username,
            password
        });

        // Сохраняем токен в localStorage
        if (response.data.data?.authToken) {
            localStorage.setItem('authToken', response.data.data.authToken);
        }

        return response.data;
    }

    async register(username: string, email: string, password: string): Promise<Result> {
        const response = await this.apiClient.post<Result>('/auth/register', {
            username,
            email,
            password
        });
        return response.data;
    }

    async getUser(token: string): Promise<UserResult> {
        const response = await this.apiClient.get<UserResult>('/user/get', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        } as AxiosRequestConfig);
        return response.data;
    }

    async saveUser(userData: UserBase): Promise<Result> {
        const response = await this.apiClient.post<Result>('/user/save', {
            username: userData.username,
            email: userData.email,
            avatarUrl: userData.avatar_url
        });
        return response.data;
    }

    async createPost(title: string, desc: string): Promise<PostCreateResult> {
        const response = await this.apiClient.post<PostCreateResult>('/post/create', {
            title,
            desc
        });
        return response.data;
    }

    async getPost(postId: number): Promise<PostGetResult> {
        const response = await this.apiClient.get<PostGetResult>(`/post/${postId}`);
        return response.data;
    }

    async deletePost(postId: number): Promise<Result> {
        const response = await this.apiClient.delete<Result>(`/post/${postId}`);
        return response.data;
    }

    async getPosts(offset: number, count: number, sortBy: number): Promise<PostListResult> {
        const response = await this.apiClient.get<PostListResult>('/post/list', {
            params: {
                offset: offset,
                count: count,
                sortBy: sortBy
            }
        } as AxiosRequestConfig);
        return response.data;
    }
}

export const api = new API();
