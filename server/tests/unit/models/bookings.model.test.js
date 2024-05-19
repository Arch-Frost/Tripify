import { addNewBooking, getAllBookings, confirmBooking } from '../../../src/models/bookings/bookings.model.js';
import bookings from '../../../src/models/bookings/bookings.mongo.js';

jest.mock('../../../src/models/bookings/bookings.mongo.js');

describe('Booking Model Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for getAllBookings method
  it('should get all bookings', async () => {
    const mockBookings = [
      { id: 1, customerName: 'John Doe', bookingStatus: false },
      { id: 2, customerName: 'Jane Doe', bookingStatus: true },
    ];

    bookings.find.mockResolvedValue(mockBookings);

    const result = await getAllBookings();
    expect(result.status).toBe(true);
    expect(result.result).toEqual(mockBookings);
  });

  // Test for confirmBooking method
  it('should confirm a booking', async () => {
    const bookingId = 1;
    const mockBooking = { id: bookingId, bookingStatus: false };

    bookings.findOne.mockResolvedValue(mockBooking);
    bookings.updateOne.mockResolvedValue({ nModified: 1 }); // Assuming booking is successfully updated

    const result = await confirmBooking(bookingId);
    expect(result.status).toBe(true);
  });

  it('should return false if booking not found', async () => {
    const bookingId = 1;

    bookings.findOne.mockResolvedValue(null);

    const result = await confirmBooking(bookingId);
    expect(result.status).toBe(false);
  });

  it('should return true if booking status not updated', async () => {
    const bookingId = 1;
    const mockBooking = { id: bookingId, bookingStatus: false };

    bookings.findOne.mockResolvedValue(mockBooking);
    bookings.updateOne.mockResolvedValue({ nModified: 0 }); // Assuming booking status not updated

    const result = await confirmBooking(bookingId);
    expect(result.status).toBe(true);
  });
});
