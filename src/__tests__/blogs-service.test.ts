import "reflect-metadata";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {container} from "../composition-root";
import {BlogsService} from "../domain/blogs-service";


describe('integration tests for BlogsService', () => {
    const blogsService = container.resolve(BlogsService);

    const validBlog = {
        name: 'Andrey',
        youtubeUrl: "https://www.youtube.com"
    }

    let mongoServer: MongoMemoryServer
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })

    describe('blogs', () => {
        it("should return new blogs", async () => {
            const result = await blogsService.createBlog(validBlog.name, validBlog.youtubeUrl);
            expect(result).toBeDefined()
            if (!result) throw new Error('create blog error')
            expect(result.name).toBe(validBlog.name);
            expect(result.youtubeUrl).toBe(validBlog.youtubeUrl);
        });
    })
})
