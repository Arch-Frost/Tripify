import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import { usersRouter } from '../../src/routes/users/users.router.js';

const app = express();
app.use(express.json());
app.use('/users', usersRouter);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

describe('User Routes', () => {
    it('should add a new user', async () => {
        const userData = {
            email: 'user@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe'
        };

        const response = await request(app)
            .post('/users/addUser')
            .send(userData);

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('User created successfully!');
    });

    it('should not add a duplicate user', async () => {
        const userData = {
            email: 'user@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe'
        };

        await request(app)
            .post('/users/addUser')
            .send(userData);

        const response = await request(app)
            .post('/users/addUser')
            .send(userData);

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('User already exists!');
    });

    it('should authenticate a user with correct credentials', async () => {
        const userData = {
            email: 'user@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe'
        };

        await request(app)
            .post('/users/addUser')
            .send(userData);

        const response = await request(app)
            .post('/users/authenticateUser')
            .send({
                email: userData.email,
                password: userData.password
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('User verified successfully!');
    });

    it('should not authenticate a user with incorrect password', async () => {
        const userData = {
            email: 'user@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe'
        };

        await request(app)
            .post('/users/addUser')
            .send(userData);

        const response = await request(app)
            .post('/users/authenticateUser')
            .send({
                email: userData.email,
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Incorrect Password!');
    });

    it('should not authenticate a non-existent user', async () => {
        const response = await request(app)
            .post('/users/authenticateUser')
            .send({
                email: 'nonexistent@example.com',
                password: 'password'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('User not found!');
    });

    it('should get all users', async () => {
        const userData1 = {
            email: 'user1@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe'
        };

        const userData2 = {
            email: 'user2@example.com',
            password: 'password',
            firstName: 'Jane',
            lastName: 'Doe'
        };

        await request(app)
            .post('/users/addUser')
            .send(userData1);

        await request(app)
            .post('/users/addUser')
            .send(userData2);

        const response = await request(app)
            .get('/users/getAllUsers');

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.result.length).toBe(2);
    });

    it('should delete a user by id', async () => {
        const userData = {
            id: 33000,
            email: 'user@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe'
        };

        await request(app)
            .post('/users/addUser')
            .send(userData);

        const userId = 33000;

        const response = await request(app)
            .post(`/users/deleteUser/${userId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('User deleted successfully!');
    });

    it('should get a user by id', async () => {
        const userData = {
            id: 33000,
            email: 'user@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe'
        };

        await request(app)
            .post('/users/addUser')
            .send(userData);

        const userId = 33000;

        const response = await request(app)
            .get(`/users/getUserById/${userId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.result.email).toBe(userData.email);
    });
});
