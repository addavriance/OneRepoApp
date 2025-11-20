import {Document, model, Schema, Model} from "mongoose";
import {PostBase, UserBase} from "../shared/interfaces";

export interface Timestamp {
    createdAt: Date;
    updatedAt: Date;
}

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
    findByAuthorId(id: string): Promise<IPost[]>;
    findByAuthorName(name: string): Promise<IPost[]>;
}

const postSchema: Schema<IPost, IPostModel> = new Schema<IPost, IPostModel>({
    author: { type: Schema.Types.ObjectId, index: true, ref: 'IUser' },
    id: { type: Number, required: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 30 },
    desc: { type: String, required: true, trim: true, minlength: 0, maxlength: 300 }
});

postSchema.statics.findByAuthorId = async function (id: string) {
    return this.find({author: id});
}

postSchema.statics.findByAuthorId = async function (id: string) {
    const user= await User.findOne({_id: id}).exec() as IUser;
    if (!user) return null;
    return this.find({author: user.username});
}

postSchema.index({author: 1, id: 1}, {unique: true});

export const User = model<IUser, IUserModel>('User', userSchema);
export const Post = model<IPost, IPostModel>('Post', postSchema);

