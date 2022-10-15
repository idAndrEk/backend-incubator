import "reflect-metadata";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {container} from "../composition-root";
import {BlogsService} from "../domain/blogs-service";


describe('integration tests for BlogsService', () => {
    const blogsService = container.resolve(BlogsService);

    let mongoServer: MongoMemoryServer
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })

    describe('blogs', () => {
        it("should return new blogs", async () => {
            const result = await blogsService.createBlog("Andrey", "https://www.youtube.com");
            expect(result?.name).toBe("Andrey");
            expect(result?.youtubeUrl).toBe("https://www.youtube.com");
        });
    })
})
