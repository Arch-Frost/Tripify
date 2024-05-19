import request from 'supertest';
import express from 'express';
import {
    adminsRouter
} from '../../src/routes/admin/admins.router.js';

const app = express();
app.use(express.json());
app.use('/admin', adminsRouter);

describe('Admin Routes', () => {
    it('should add a new admin', async () => {
        const adminData = {
            email: 'testadmin@example.com',
            password: 'password',
            firstName: 'Test',
            lastName: 'Admin'
        };
        const response = await request(app)
            .post('/admin/addAdmin')
            .send(adminData);
        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe(true);
    });

    it('should authenticate admin with correct credentials', async () => {
        const adminData = {
            email: 'testadmin@example.com',
            password: 'password'
        };
        const response = await request(app)
            .post('/admin/authenticateAdmin')
            .send(adminData);
        expect(response.statusCode).toBe(200);
    });

});
