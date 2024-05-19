import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import { bookingsRouter } from '../../src/routes/bookings/bookings.router.js';
import { hotelsRouter } from '../../src/routes/hotels/hotels.router.js'; // Assuming you might need hotel routes for creating bookings

const app = express();
app.use(express.json());
app.use('/bookings', bookingsRouter);
app.use('/hotels', hotelsRouter); // If hotel routes are needed for test setup

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

describe('Booking Routes', () => {
    it('should add a new booking', async () => {
        // You might need to create a hotel first to book a room
        const hotelData = {
            id: 1,
            name: 'Test Hotel',
            country: 'Test Country',
            city: 'Test City',
            numberOfRooms: 10,
            numberOfAvailableRooms: 10,
            rating: 4.5,
            image: 'testimage.jpg'
        };

        await request(app)
            .post('/hotels/addNewHotel')
            .send(hotelData);

        const bookingData = {
            customerName: 'John Doe',
            customerEmail: 'johndoe@example.com',
            customerContactNumber: '1234567890',
            hotelName: 'Test Hotel',
            country: 'Test Country',
            city: 'Test City',
            arrivalTime: '12:00 PM',
            roomType: 'Deluxe',
            roomNumber: 101
        };

        const response = await request(app)
            .post('/bookings/addNewBooking')
            .send(bookingData);

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Room has been booked successfully!');
    });

    it('should get all bookings', async () => {
        const response = await request(app)
            .get('/bookings/getAllBookings');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);
    });

    it('should confirm a booking by id', async () => {
        // First, add a new booking
        const hotelData = {
            id: 1,
            name: 'Test Hotel',
            country: 'Test Country',
            city: 'Test City',
            numberOfRooms: 10,
            numberOfAvailableRooms: 10,
            rating: 4.5,
            image: 'testimage.jpg'
        };

        await request(app)
            .post('/hotels/addNewHotel')
            .send(hotelData);

        const bookingData = {
            customerName: 'John Doe',
            customerEmail: 'johndoe@example.com',
            customerContactNumber: '1234567890',
            hotelName: 'Test Hotel',
            country: 'Test Country',
            city: 'Test City',
            arrivalTime: '12:00 PM',
            roomType: 'Deluxe',
            roomNumber: 101
        };

        const addBookingResponse = await request(app)
            .post('/bookings/addNewBooking')
            .send(bookingData);

        // Now, confirm the booking
        const bookingId = addBookingResponse.body.id; // Adjust this based on your response
        const response = await request(app)
            .post(`/bookings/confirmBooking/${bookingId}`);
        expect(response.statusCode).toBe(200);
    });
});
