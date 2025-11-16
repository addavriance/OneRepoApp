import {IUser} from "../db";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
