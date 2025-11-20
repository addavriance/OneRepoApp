import express, {Router, Request, Response} from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {AuthService} from "./services/auth.service";
import {authMiddleware} from "./middleware/auth.middleware";
import {z} from "zod";
import {validateBody, validateParams} from "./middleware/validation.middleware";
import {ServiceFactory} from "./services/service.factory";

const app = express();

app.use(cors());
app.use(express.json());

await mongoose.connect('mongodb://localhost:27017/mydb');

const authRoutes = new Router();
const authService = new AuthService();

const postRoutes = new Router();

const userRoutes = new Router();

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

authRoutes.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        const result = await authService.login(username, password);
        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: {server: "Internal server error"},
            code: 500
        });
    }
});

const registerSchema = z.object({
    username: z.string().min(3, "Minimum length is 3"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Minimum length is 6"),
});

authRoutes.post('/register', validateBody(registerSchema), async (req: Request, res: Response) => {
    try {
        const {username, email, password} = req.body;
        const result = await authService.register(username, email, password);
        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: {server: "Internal server error"},
            code: 500
        });
    }
});

userRoutes.get('/get', authMiddleware, async (req: Request, res: Response) => {
    res.status(200).json({
            error: false,
            code: 200,
            data: {
                username: req.user?.username,
                email: req.user?.email,
                avatar_url: req.user?.avatar_url,
            }
        }
    )
});

const saveUserSchema = z.object({
    username: z.string().min(3, "Minimum length is 3"),
    email: z.email("Invalid email format"),
    avatarUrl: z.url("Invalid url format").optional(),
});

userRoutes.post('/save', authMiddleware, validateBody(saveUserSchema), async (req: Request, res: Response) => {
    try {
        const userService = ServiceFactory.createUserService(req);

        const data = req.body;
        const result = await userService.saveUser(data);
        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: {server: "Internal server error"},
            code: 500
        });
    }
})

const getPostsSchema = z.object({
    offset: z.number(),
    count: z.number(),
    sortBy: z.number(),
})

postRoutes.get('/list', authMiddleware, validateBody(getPostsSchema), async (req: Request, res: Response) => {
    try {
        const postService = ServiceFactory.createPostService(req);

        const {offset, count, sortBy} = req.body;

        const result = await postService.getPosts(offset, count, sortBy);

        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: {server: "Internal server error"},
            code: 500
        });
    }
})

const createPostSchema = z.object({
    title: z.string(),
    desc: z.string(),
})

postRoutes.post('/create', authMiddleware, validateBody(createPostSchema), async (req: Request, res: Response) => {
    try {
        const postService = ServiceFactory.createPostService(req);

        const {title, desc} = req.body;

        const result = await postService.createPost(title, desc);

        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: {server: "Internal server error"},
            code: 500
        });
    }
})

const getDeletePostSchema = z.object({
    id: z.string().min(1, 'Post ID is required').regex(new RegExp(/^\d+$/), "Post ID must be a positive number")
})

postRoutes.get('/:id', authMiddleware, validateParams(getDeletePostSchema), async (req: Request, res: Response) => {
    try {
        const postId = parseInt(req.params.id);
        const postService = ServiceFactory.createPostService(req);
        const result = await postService.getPost(postId);

        res.status(result.code).json(result)
    } catch {
        res.status(500).json({
            error: true,
            messages: { server: "Internal server error" },
            code: 500
        });
    }
});

postRoutes.delete('/:id', authMiddleware, validateParams(getDeletePostSchema), async (req: Request, res: Response) => {
    try {
        const postId = parseInt(req.params.id);

        const postService = ServiceFactory.createPostService(req);
        const result = await postService.deletePost(postId);

        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: { server: "Internal server error" },
            code: 500
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({status: "OK"});
});

app.listen(3000, () => console.log('server on 3000'));
