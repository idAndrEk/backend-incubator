import {MongoClient} from "mongodb";

const mongoUri = process.env.MongoURI || "mongodb://0.0.0.0:27017";
const client = new MongoClient(mongoUri);
const db = client.db("home-bloggers");
export const bloggersCollection = db.collection<bloggersType>("blogger");

export type bloggersType = {
    id: number
    name: string
    youtubeUrl: string
}

export async function runDb() {
    try {
        await client.connect();
        await client.db("Bloggers").command({ping: 1});
        console.log("Connected successfully to mongo server")
    } catch {
        console.log("Cant`t connect to db")
        await client.close();
    }
}