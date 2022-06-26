import {MongoClient} from "mongodb";
import {envSetting} from "../env_setting";

const mongoUri = envSetting.MongoURI

const client = new MongoClient(mongoUri);
const db = client.db("home-bloggers");
// const dbPost = client.db("Home-Post")
export const bloggersCollection = db.collection<bloggersType>("blogger");
export const postCollection = db.collection<postsType>("post")

export type bloggersType = {
    id: number
    name: string
    youtubeUrl: string
}

export type postsType = {
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName: string
}

export async function runDb() {
    try {
        await client.connect();
        await client.db("home-bloggers").command({ping: 1});
        console.log("Connected successfully to mongo server")
    } catch {
        console.log("Cant`t connect to db")
        await client.close();
    }
}