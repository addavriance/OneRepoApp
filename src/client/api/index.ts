import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {
    APIActions,
    AuthResult,
    PostCreateResult,
    PostGetResult,
    PostListResult,
    Result, TodoCreateData, TodoCreateResult, TodoListResult,
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
        const response: AxiosResponse<AuthResult> = await this.apiClient.post('/auth/login', {
            username,
            password
        });

        if (response.data.data?.authToken) {
            localStorage.setItem('authToken', response.data.data.authToken);
        }

        return response.data;
    }

    async register(username: string, email: string, password: string): Promise<Result> {
        const response: AxiosResponse<Result> = await this.apiClient.post('/auth/register', {
            username,
            email,
            password
        });
        return response.data;
    }

    async getUser(token: string): Promise<UserResult> {
        const response: AxiosResponse<UserResult> = await this.apiClient.get('/user/get', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        } as AxiosRequestConfig);
        return response.data;
    }

    async saveUser(userData: UserBase): Promise<Result> {
        const response: AxiosResponse<Result> = await this.apiClient.post('/user/save', {
            username: userData.username,
            email: userData.email,
            avatar_url: userData.avatar_url
        });
        return response.data;
    }

    async createPost(title: string, desc: string): Promise<PostCreateResult> {
        const response: AxiosResponse<PostCreateResult> = await this.apiClient.post('/post/create', {
            title,
            desc
        });
        return response.data;
    }

    async getPost(postId: number): Promise<PostGetResult> {
        const response: AxiosResponse<PostGetResult> = await this.apiClient.get(`/post/${postId}`);
        return response.data;
    }

    async deletePost(postId: number): Promise<Result> {
        const response: AxiosResponse<Result> = await this.apiClient.delete(`/post/${postId}`);
        return response.data;
    }

    async getPosts(offset: number, count: number, sortBy: number): Promise<PostListResult> {
        const response: AxiosResponse<PostListResult> = await this.apiClient.get('/post/list', {
            params: {
                offset: offset,
                count: count,
                sortBy: sortBy
            }
        } as AxiosRequestConfig);
        return response.data;
    }

    async getTodos(): Promise<TodoListResult> {
        const response: AxiosResponse<TodoListResult> = await this.apiClient.get('/todo/list');
        return response.data;
    }

    async createTodo(data: TodoCreateData): Promise<TodoCreateResult> {
        const response: AxiosResponse<TodoCreateResult> = await this.apiClient.post('/todo/create', {...data});
        return response.data;
    }

    async deleteTodo(id: number): Promise<Result> {
        const response: AxiosResponse<Result> = await this.apiClient.delete(`/todo/${id}`);
        return response.data;
    }

    async toggleTodo(id: number): Promise<TodoCreateResult> {
        const response: AxiosResponse<TodoCreateResult> = await this.apiClient.put(`/todo/${id}`);
        return response.data;
    }

}

export const api = new API();
