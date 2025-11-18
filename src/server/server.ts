import express, {Router, Request, Response} from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {AuthService} from "./services/auth.service";
import {UserService} from "./services/user.service";
import {authMiddleware} from "./middleware/auth.middleware";
import {PostService} from "./services/post.service";
import {z} from "zod";
import {validateBody} from "./middleware/validation.middleware";

const app = express();

app.use(cors());
app.use(express.json());

await mongoose.connect('mongodb://localhost:27017/mydb');

const authRoutes = new Router();
const authService = new AuthService();

const postsRoutes = new Router();
// const postsService = new PostsService();

const userRoutes = new Router();
const userService = new UserService();

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

userRoutes.get('/getUser', authMiddleware, async (req: Request, res: Response) => {
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

userRoutes.post('/saveUser', authMiddleware, validateBody(saveUserSchema), async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await userService.saveUser(data, req);
        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: {server: "Internal server error"},
            code: 500
        });
    }
})


    const result = await userService.saveUser(data, req);

    res.status(result.code).json(result);
})

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/user/', userRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({status: "OK"});
});

app.listen(3000, () => console.log('server on 3000'));
