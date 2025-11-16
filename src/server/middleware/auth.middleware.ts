import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {User} from "../db";

interface JwtPayload {
    userId: string;
    email: string;
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: true,
                message: 'No token provided'
            });
            return;
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, process.env.JWT_SECRET  || 'fallback-secret') as JwtPayload;

        if (!decoded.userId) {
            res.status(401).json({
                error: true,
                code: 401,
                message: 'Invalid token'
            });
            return;
        }

        const user = await User.findById(decoded.userId).select('-password').exec();

        if (!user) {
            res.status(401).json({
                error: true,
                code: 401,
                message: 'User not found'
            });
            return;
        }

        req.user = user;
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                error: true,
                code: 401,
                message: 'Invalid token'
            });
        } else if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                error: true,
                code: 401,
                message: 'Token expired'
            });
        } else {
            res.status(500).json({
                error: true,
                code: 500,
                message: 'Server error'
            });
        }
    }
};
