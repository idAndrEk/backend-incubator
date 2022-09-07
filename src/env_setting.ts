require('dotenv').config()

export const envSetting = {
    MongoURI: process.env.MongoURI || "mongodb://0.0.0.0:27017",
    MongooseURI: process.env.MongoURI || "mongodb://0.0.0.0:27017",
    PORT: process.env.PORT || 5000,
    JWT_ACCESS: process.env.JWT_ACCESS_SECRET || 'SECRET',
    JWT_REFRESH: process.env.JWT_REFRESH_SECRET|| 'SECRET'
}
