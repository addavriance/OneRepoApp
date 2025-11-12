import express, {Router, Request, Response} from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {AuthService} from "./services/auth.service";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mydb');

const authRoutes = new Router();
const authService = new AuthService();

const postsRoutes = new Router();
// const postsService = new PostsService();

authRoutes.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        res.status(result.code).json(result);
    } catch {
        res.status(500).json({
            error: true,
            messages: { server: "Internal server error" },
            code: 500
        });
    }
})

authRoutes.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const result = await authService.register(username, email, password);
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
app.use('/api/posts', postsRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.listen(3000, () => console.log('server on 3000'));
