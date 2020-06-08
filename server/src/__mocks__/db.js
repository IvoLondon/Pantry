import mongoose from 'mongoose';
import { Store } from './../resources/store/store.model';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let db;

export const startDB = async () => {
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    };
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    db = await mongoose.connect(mongoUri, opts, (err) => {
        if (err) console.error(err);
    });
}

export const stopDB = async () => {
    await db.disconnect();
    await mongoServer.stop();
}

export const clearDB = async () => {
    try {
        await Store.deleteMany({})
        return
    } catch (e) {}
}