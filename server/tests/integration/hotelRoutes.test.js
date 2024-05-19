import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import { hotelsRouter } from '../../src/routes/hotels/hotels.router.js';

const app = express();
app.use(express.json());
app.use('/hotels', hotelsRouter);

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

describe('Hotel Routes', () => {
    it('should add a new hotel', async () => {
        const hotelData = {
            name: 'Hotel California',
            numberOfRooms: 100,
            numberOfAvailableRooms: 20,
            country: 'USA',
            city: 'Los Angeles',
            image: "exampleimage",
            rating: 4.5
        };

        const response = await request(app)
            .post('/hotels/addNewHotel')
            .send(hotelData);

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Hotel created successfully!');
    });

    it('should not add a duplicate hotel', async () => {
        const hotelData = {
            name: 'Hotel California',
            numberOfRooms: 100,
            numberOfAvailableRooms: 20,
            country: 'USA',
            city: 'Los Angeles',
            image: "exampleimage",
            rating: 4.5
        };

        await request(app)
            .post('/hotels/addNewHotel')
            .send(hotelData);

        const response = await request(app)
            .post('/hotels/addNewHotel')
            .send(hotelData);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Hotel already exists!');
    });

    it('should get all hotels', async () => {
        const hotelData1 = {
            name: 'Hotel California',
            numberOfRooms: 100,
            numberOfAvailableRooms: 20,
            country: 'USA',
            city: 'Los Angeles',
            image: "exampleimage",
            rating: 4.5
        };

        const hotelData2 = {
            name: 'Grand Budapest Hotel',
            numberOfRooms: 200,
            numberOfAvailableRooms: 50,
            country: 'Hungary',
            city: 'Budapest',
            image: "exampleimage",
            rating: 5
        };

        await request(app)
            .post('/hotels/addNewHotel')
            .send(hotelData1);

        await request(app)
            .post('/hotels/addNewHotel')
            .send(hotelData2);

        const response = await request(app)
            .get('/hotels/getAllHotels');

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.result.length).toBe(2);
    });

    it('should get a hotel by id', async () => {
        const hotelData = {
            id: 33000,
            name: 'Hotel California',
            numberOfRooms: 100,
            numberOfAvailableRooms: 20,
            country: 'USA',
            city: 'Los Angeles',
            image: "exampleimage",
            rating: 4.5
        };

        await request(app)
            .post('/hotels/addNewHotel')
            .send(hotelData);

        const hotelId = 33000;

        const response = await request(app)
            .get(`/hotels/getHotelById/${hotelId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.result.name).toBe(hotelData.name);
    });

    it('should delete a hotel by id', async () => {
        const hotelData = {
            id: 33000,
            name: 'Hotel California',
            numberOfRooms: 100,
            numberOfAvailableRooms: 20,
            country: 'USA',
            city: 'Los Angeles',
            image: "exampleimage",
            rating: 4.5
        };

        await request(app)
            .post('/hotels/addNewHotel')
            .send(hotelData);

        const hotelId = 33000;

        const response = await request(app)
            .get(`/hotels/deleteHotelById/${hotelId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Hotel Deleted Successfully!');
    });

    it('should edit a hotel by id', async () => {
        const hotelData = {
            id: 33000,
            name: 'Hotel California',
            numberOfRooms: 100,
            numberOfAvailableRooms: 20,
            country: 'USA',
            city: 'Los Angeles',
            image: "exampleimage",
            rating: 4.5
        };

        await request(app)
            .post('/hotels/addNewHotel')
            .send(hotelData);

        const hotelId = 33000;

        const updatedHotelData = {
            name: 'Hotel California - Updated',
            numberOfRooms: 120,
            numberOfAvailableRooms: 25,
            country: 'USA',
            city: 'Los Angeles',
            rating: 4.7
        };

        const response = await request(app)
            .post(`/hotels/editHotelById/${hotelId}`)
            .send(updatedHotelData);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Hotel updated successfully!');
    });
});
