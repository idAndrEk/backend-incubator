import 'dotenv/config'

export const envSetting = {
    MongoURI: process.env.MongoURI || "mongodb://0.0.0.0:27017",
    PORT: process.env.PORT || 5000
}
