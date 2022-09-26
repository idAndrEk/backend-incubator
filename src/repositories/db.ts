import {ObjectId} from "mongodb";
import {envSetting} from "../env_setting";
import {BloggerType} from "../types/bloggersTypes";
import {PostType} from "../types/postsTypes";
import {CommentType} from "../types/CommentsTypes";
import {TokenType, UserAccType} from "../types/UsersTypes";
import {InputType} from "../types/InputTypes";
import mongoose from "mongoose";
import {LikeCommentCollectionType, LikePostCollectionType, LikesType} from "../types/likeTypes";

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
    _id: {type: ObjectId, required: true},
    name: {type: String, required: true},
    youtubeUrl: {type: String, required: true}
})

bloggerSchema.set('toJSON', {
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
    }
})

const NewestLikesSchema = new mongoose.Schema({
    addedAt: Date,
    userId: String,
    login: String
})

NewestLikesSchema.set('toJSON', {
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id
    }
})

const postSchema = new mongoose.Schema<PostType>({
    _id: {type: ObjectId, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    bloggerId: {type: String, required: true},
    bloggerName: {type: String, required: true},
    addedAt: { type: Date, required: true },
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        newestLikes: [NewestLikesSchema]
    }
})

postSchema.set('toJSON', {
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
    }
})

const commentSchema = new mongoose.Schema<CommentType>({
    _id: {type: ObjectId, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    addedAt: {type: Date, default: Date.now},
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String
    }
})

commentSchema.set('toJSON', {
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
    }
})

const userSchema = new mongoose.Schema<UserAccType>({
    _id: {type: ObjectId, required: true},
    accountData: {
        userName: {type: String, required: true},
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

userSchema.set('toJSON', {
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
    }
})

const inputSchema = new mongoose.Schema<InputType>({
    ip: {type: String, required: true},
    endpoint: {type: String, required: true},
    date: Number
})

inputSchema.set('toJSON', {
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
    }
})

const tokenSchema = new mongoose.Schema<TokenType>({
    refreshToken: {type: String, required: true}
})

tokenSchema.set('toJSON', {
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
    }
})


const likePostSchema = new mongoose.Schema<LikePostCollectionType>({
    postId: {type: ObjectId, required: true},
    status: { type: String, required: true },
    createdAt: { type: Date, required: true },
    userId: {type: ObjectId, required: true} //UserId
})

const likeCommentSchema = new mongoose.Schema<LikeCommentCollectionType>({
    commentId: {type: ObjectId, required: true},
    status: { type: String, required: true },
    createdAt: { type: Date, required: true },
    userId: {type: ObjectId, required: true} //UserId
})

const likesSchema = new mongoose.Schema<LikesType>({
    parentId: {type: ObjectId, required: true},
    status: { type: String, required: true },
    addedAt: { type: Date, required: true },
    userId: {type: ObjectId, required: true},
    login: {type: String, required: true},
})

export const BloggerModelClass = mongoose.model('bloggers', bloggerSchema)
export const PostModelClass = mongoose.model('posts', postSchema)
export const CommentModelClass = mongoose.model('comments', commentSchema)
export const UserModelClass = mongoose.model('users', userSchema)
export const InputModelClass = mongoose.model('InputsType', inputSchema)
export const TokenModelClass = mongoose.model('Token', tokenSchema)
export const PostLikeModelClass = mongoose.model('likesPost', likePostSchema)
export const CommentLikeModelClass = mongoose.model('likesComment', likeCommentSchema)
export const LikesModelClass = mongoose.model('likesCollection', likesSchema)

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

