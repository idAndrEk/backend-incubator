import {MongoClient} from "mongodb";
import {envSetting} from "../env_setting";
import {BloggerPayloadType} from "../types/bloggersTypes";
import {PostPayloadType } from "../types/postsTypes";
import {CommentPayloadType} from "../types/CommentsTypes";
import {UserAccType} from "../types/UsersTypes";
import {InputType} from "../types/InputType";

const mongoUri = envSetting.MongoURI
// console.log(mongoUri)

const client = new MongoClient(mongoUri);
export const db = client.db("home-bloggers");
export const bloggersCollection = db.collection<BloggerPayloadType>("blogger");
export const postCollection = db.collection<PostPayloadType>("post");
export const commentCollection = db.collection<CommentPayloadType>("comment");
export const usersCollection = db.collection<UserAccType>("user");
export const requestIpData = db.collection<InputType>("InputType")

export async function runDb() {
    try {
        await client.connect();
        await client.db("home-bloggers").command({ping: 1});
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Cant`t connect to db!");
        await client.close();
    }
}



// const result: any = await bloggersCollection.find({$regex: name});
// return result