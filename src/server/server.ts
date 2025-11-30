import express, {Router, Request, Response} from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {AuthService} from "./services/auth.service";
import {authMiddleware} from "./middleware/auth.middleware";
import {z} from "zod";
import {validateBody, validateParams, validateQuery} from "./middleware/validation.middleware";
import {ServiceFactory} from "./services/service.factory";

const app = express();

app.use(cors());
app.use(express.json());

await mongoose.connect('mongodb://localhost:27017/mydb');

const authRoutes = new Router();
const authService = new AuthService();

const postRoutes = new Router();

const userRoutes = new Router();

const todoRoutes = new Router();

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
    avatar_url: z.url("Invalid url format").optional(),
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
    offset: z.string().min(1, 'offset is required').regex(new RegExp(/^\d+$/), "Offset must be a positive number"),
    count: z.string().min(1, 'count is required').regex(new RegExp(/^\d+$/), "Count must be a positive number"),
    sortBy: z.string().min(1, 'sortBy is required').regex(new RegExp(/^\d+$/), "sortBy must be a positive number"),
})

postRoutes.get('/list', authMiddleware, validateQuery(getPostsSchema), async (req: Request, res: Response) => {
    try {
        const postService = ServiceFactory.createPostService(req);

        const {offset, count, sortBy} = req.query;

        const result = await postService.getPosts(
            parseInt(offset as string),
            parseInt(count as string),
            parseInt(sortBy as string)
        );

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

const createTodoSchema = z.object({
    title: z.string().max(50),
    description: z.string().optional(),
    due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in format YYYY-MM-DD'
    }).optional(),
    reminder_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Reminder time must be in format HH:MM (24-hour format)'
    }).optional(),
    reminder_interval: z.number().int().min(1).max(10),
})

todoRoutes.post('/create', authMiddleware, validateBody(createTodoSchema), async (req: Request, res: Response) => {
    try {
        const todoData = req.body;

        const todoService = ServiceFactory.createTodoService(req);
        const result = await todoService.createTodo(todoData);

        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: { server: "Internal server error" },
            code: 500
        });
    }
});

const toggleDeleteTodoSchema = z.object({
    id: z.string().min(1, 'Todo ID is required').regex(new RegExp(/^\d+$/), "Todo ID must be a positive number")
})

todoRoutes.delete('/:id', authMiddleware, validateParams(toggleDeleteTodoSchema), async (req: Request, res: Response) => {
    try {
        const todoId = parseInt(req.params.id);

        const todoService = ServiceFactory.createTodoService(req);
        const result = await todoService.deleteTodo(todoId);

        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: { server: "Internal server error" },
            code: 500
        });
    }
})

todoRoutes.put('/:id', authMiddleware, validateParams(toggleDeleteTodoSchema), async (req: Request, res: Response) => {
    try {
        const todoId = parseInt(req.params.id);

        const todoService = ServiceFactory.createTodoService(req);
        const result = await todoService.toggleTodo(todoId);

        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: { server: "Internal server error" },
            code: 500
        });
    }
})

todoRoutes.get('/list', authMiddleware, async (req: Request, res: Response) => {
    try {
        const todoService = ServiceFactory.createTodoService(req);
        const result = await todoService.getTodos();

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
app.use('/api/todo', todoRoutes)

app.get('/health', (req, res) => {
    res.status(200).json({status: "OK"});
});

app.listen(3000, () => console.log('server on 3000'));
