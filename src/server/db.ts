import {Document, model, Schema, Model} from "mongoose";
import {PostBase, Timestamp, TodoBase, UserBase} from "../shared/interfaces";


export interface IUser extends UserBase, Timestamp, Document {
    password: string;
}

export interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
    isUsernameTaken(username: string, excludeUserId?: string): Promise<boolean>;
}

const userSchema: Schema<IUser, IUserModel> = new Schema<IUser, IUserModel>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    avatar_url: {
        type: String,
        default: null
    }
}, {
    timestamps: true // автоматически добавляет createdAt и updatedAt
});

userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({email: email.toLowerCase()});
};

userSchema.statics.findByUsername = function (username: string) {
    return this.findOne({username});
};

userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string) {
    const user = await this.findOne({
        email: email.toLowerCase(),
        _id: {$ne: excludeUserId}
    });

    return !!user;
};

userSchema.statics.isUsernameTaken = async function (username: string, excludeUserId?: string) {
    const user = await this.findOne({
        username,
        _id: { $ne: excludeUserId }
    });
    return !!user;
};

userSchema.index({email: 1, username: 1});
userSchema.index({createdAt: -1});

export interface IPost extends PostBase<Schema.Types.ObjectId>, Timestamp, Document { }

export interface IPostModel extends Model<IPost> {
    findByAuthorId(authorId: Schema.Types.ObjectId): Promise<IPost[]>;

    findByAuthorUsername(username: string): Promise<IPost[]>;
}

const postSchema: Schema<IPost, IPostModel> = new Schema<IPost, IPostModel>({
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    desc: {
        type: String,
        required: true,
        trim: true,
        minlength: 0,
        maxlength: 300
    },
}, {
    timestamps: true
});

postSchema.statics.findByAuthorId = async function (authorId: Schema.Types.ObjectId) {
    return this.find({author: authorId});
}

postSchema.statics.findByAuthorUsername = async function (username: string) {
    const user = await User.findOne({username}).exec();
    if (!user) return [];
    return this.find({author: user._id});
}

postSchema.index({author: 1, id: 1}, {
    unique: true,
});

postSchema.index({id: 1});

export interface ITodo extends TodoBase, Timestamp, Document {
    author: Schema.Types.ObjectId;
}

export type ITodoModel = Model<ITodo>

const todoSchema: Schema<ITodo, ITodoModel> = new Schema<ITodo, ITodoModel>({
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 0,
        maxlength: 50
    },
    description: {
        type: String,
        trim: true,
        minlength: 0,
        maxlength: 300
    },
    completed: {
        type: Boolean,
        default: false,
    },
    due_date: String,
    reminder_time: String,
    reminder_interval: Number,
}, {
    timestamps: true
})

todoSchema.index({author: 1, id: 1}, {
    unique: true,
});

todoSchema.index({id: 1});

export const User = model<IUser, IUserModel>('User', userSchema);
export const Post = model<IPost, IPostModel>('Post', postSchema);
export const Todo = model<IPost, ITodoModel>('Todo', todoSchema);
