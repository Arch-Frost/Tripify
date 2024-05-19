import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import { contactUsRouter } from '../../src/routes/contactUs/contactUs.router.js';

const app = express();
app.use(express.json());
app.use('/contactUs', contactUsRouter);

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

describe('ContactUs Routes', () => {
    it('should add a new complaint', async () => {
        const complaintData = {
            email: 'test@example.com',
            problem: 'Issue with booking',
            description: 'I encountered an issue while booking',
            firstName: 'John',
            lastName: 'Doe'
        };

        const response = await request(app)
            .post('/contactUs/addNewComplaint')
            .send(complaintData);

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Response submitted successfully!');
    });

    it('should not add a duplicate complaint', async () => {
        const complaintData = {
            email: 'test@example.com',
            problem: 'Issue with booking',
            description: 'I encountered an issue while booking',
            firstName: 'John',
            lastName: 'Doe'
        };

        await request(app)
            .post('/contactUs/addNewComplaint')
            .send(complaintData);

        const response = await request(app)
            .post('/contactUs/addNewComplaint')
            .send(complaintData);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('This response is already submitted!');
    });

    it('should get all complaints', async () => {
        const response = await request(app)
            .get('/contactUs/getAllComplaints');

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
    });

    it('should mark a complaint as resolved', async () => {
        const complaintData = {
            email: 'test@example.com',
            problem: 'Issue with booking',
            description: 'I encountered an issue while booking',
            firstName: 'John',
            lastName: 'Doe'
        };

        const addResponse = await request(app)
            .post('/contactUs/addNewComplaint')
            .send(complaintData);

        const complaintId = addResponse.body.id;

        const response = await request(app)
            .post(`/contactUs/resolveComplaint/${complaintId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(false);
    });
});
