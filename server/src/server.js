import http from 'http';
import { app } from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set("strictQuery", false);

const PORT = 8000;
const MONGO_URL = process.env.MONGODB_URL;

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('Mongodb connection ready');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

await mongoose.connect(MONGO_URL);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
