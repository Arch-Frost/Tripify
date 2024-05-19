import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import hotels from '../../../src/models/hotels/hotels.mongo.js';
import {
  addNewHotel,
  getAllHotels,
  getHotelById,
  deleteHotelById,
  editHotelById
} from '../../../src/models/hotels/hotels.model.js';

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
  await hotels.deleteMany({});
});

describe('Hotel Model Tests', () => {
  it('should add a new hotel', async () => {
    const hotelData = {
      name: 'Test Hotel',
      country: 'Test Country',
      city: 'Test City',
      numberOfRooms: 10,
      numberOfAvailableRooms: 10,
      image:"exampleimage",
      rating: 4
    };

    const result = await addNewHotel(hotelData);

    expect(result.status).toBe(true);
    expect(result.message).toBe('Hotel created successfully!');

    const hotel = await hotels.findOne({ name: hotelData.name });
    expect(hotel).not.toBeNull();
    expect(hotel.name).toBe(hotelData.name);
  });

  // Add more tests for other scenarios such as hotel already exists, error handling, etc.

  it('should get a hotel by id', async () => {
    const hotelData = {
      id: 33000,
      name: 'Test Hotel',
      country: 'Test Country',
      city: 'Test City',
      numberOfRooms: 10,
      numberOfAvailableRooms: 10,
      image:"exampleimage",
      rating: 4
    };
    const { id } = await hotels.create(hotelData);

    const result = await getHotelById(id);

    expect(result.status).toBe(true);
    expect(result.result.name).toBe(hotelData.name);
  });

  it('should delete a hotel by id', async () => {
    const hotelData = {
      id: 33000,
      name: 'Test Hotel',
      country: 'Test Country',
      city: 'Test City',
      numberOfRooms: 10,
      numberOfAvailableRooms: 10,
      image:"exampleimage",
      rating: 4
    };
    const { id } = await hotels.create(hotelData);

    const result = await deleteHotelById(id);

    expect(result.status).toBe(true);

    const deletedHotel = await hotels.findOne({ id: id });
    expect(deletedHotel).toBeNull();
  });

  it('should edit a hotel by id', async () => {
    const hotelData = {
      id: 33000,
      name: 'Test Hotel',
      country: 'Test Country',
      city: 'Test City',
      numberOfRooms: 10,
      numberOfAvailableRooms: 10,
      image:"exampleimage",
      rating: 4
    };
    const { id } = await hotels.create(hotelData);
    const editedHotelData = {
      id: 33000,
      name: 'Edited Test Hotel',
      country: 'Edited Test Country',
      city: 'Edited Test City',
      numberOfRooms: 20,
      numberOfAvailableRooms: 20,
      image:"editedexampleimage",
      rating: 5
    };

    const result = await editHotelById(id, editedHotelData);

    expect(result.status).toBe(true);
    expect(result.message).toBe('Hotel updated successfully!');

    const editedHotel = await hotels.findOne({ id: id });
    expect(editedHotel.name).toBe(editedHotelData.name);
    expect(editedHotel.numberOfRooms).toBe(editedHotelData.numberOfRooms);

});
});
