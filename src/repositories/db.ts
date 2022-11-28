import {ObjectId} from "mongodb";
import {envSetting} from "../env_setting";
import {BloggerType} from "../types/blogsTypes";
import {PostType} from "../types/postsTypes";
import {CommentType} from "../types/commentsTypes";
import {TokenType, UserAccType} from "../types/UsersTypes";
import {InputType} from "../types/InputTypes";
import mongoose from "mongoose";
import {LikesType} from "../types/likeTypes";
import {DevicesDtoType, DevicesType} from "../types/divaseTypes";

// const client = new MongoClient(envSetting.MongoURI);
// export const db = client.db("home-blogger");
//
// export const bloggersCollection = db.collection<BloggerType>("blogger");
// export const postCollection = db.collection<PostType>("post");
// export const commentCollection = db.collection<CommentType>("comment");
// export const usersCollection = db.collection<UserAccType>("user");
// export const requestIpData = db.collection<InputType>("InputType")
// export const tokenCollection = db.collection<TokenType>("Token")

const bloggerSchema = new mongoose.Schema<BloggerType>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: Date, required: true}
})

const extendedLikesInfoSchema = new mongoose.Schema({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    myStatus: {type: String},
}, {_id: false})

const postSchema = new mongoose.Schema<PostType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    bloggerName: {type: String, required: true},
    createdAt: {type: Date, required: true},
    extendedLikesInfo: {type: extendedLikesInfoSchema}
})

const likeInfoSchema = new mongoose.Schema({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    myStatus: {type: String}
}, {_id: false})

const commentSchema = new mongoose.Schema<CommentType>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    likesInfo: {type: likeInfoSchema}
})

const userSchema = new mongoose.Schema<UserAccType>({
    accountData: {
        login: {type: String, required: true},
        email: {type: String, required: true},
        passwordHash: {type: String, required: true},
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: Date,
        isConfirmed: Boolean
    }
})

const inputSchema = new mongoose.Schema<InputType>({
    ip: {type: String, required: true},
    endpoint: {type: String, required: true},
    date: Number
})

const tokenSchema = new mongoose.Schema<TokenType>({
    refreshToken: {type: String, required: true}
})

const likesSchema = new mongoose.Schema<LikesType>({
    parentId: {type: ObjectId, required: true},
    status: {type: String, required: true},
    createdAt: {type: Date, required: true},
    userId: {type: ObjectId, required: true},
    login: {type: String, required: true},
})

const deviseSchema = new mongoose.Schema<DevicesDtoType>({
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: Date, required: true},
    deviceId: {type: String, required: true},
    userId: {type: String, required: true},
    issuedAt:{type: Date, required: true},
    expireTime:{type: Date, required: true},
})

export const BloggerModelClass = mongoose.model('blogs', bloggerSchema)
export const PostModelClass = mongoose.model('posts', postSchema)
export const CommentModelClass = mongoose.model('comments', commentSchema)
export const UserModelClass = mongoose.model('users', userSchema)
export const InputModelClass = mongoose.model('InputsType', inputSchema)
export const TokenModelClass = mongoose.model('Token', tokenSchema)
export const LikesModelClass = mongoose.model('likesCollection', likesSchema)
export const DevicesModelClass = mongoose.model('devicesCollection', deviseSchema)

export async function runDb() {
    try {
        // await client.connect();
        // await client.db("home-blogger").command({ping: 1});
        await mongoose.connect(envSetting.MongooseURI, {dbName: "home-blogger"})
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Cant`t connect to db!");
        await mongoose.disconnect();
        // await client.close();
    }
}

