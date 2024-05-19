import { addNewComplaint, getAllComplaints, markAsResolved } from '../../../src/models/contactUs/contactUs.model.js';
import contactUs from '../../../src/models/contactUs/contactUs.mongo.js';

jest.mock('../../../src/models/contactUs/contactUs.mongo.js');

describe('Contact Us Model Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not add a duplicate complaint', async () => {
    const complaintData = {
      email: 'test@example.com',
      problem: 'Issue with booking',
      description: 'I encountered an issue while booking',
      firstName: 'John',
      lastName: 'Doe'
    };

    const existingComplaint = {
      email: 'test@example.com',
      problem: 'Issue with booking',
      description: 'Another issue with booking',
      firstName: 'Jane',
      lastName: 'Doe'
    };

    contactUs.find.mockResolvedValue([existingComplaint]);

    const result = await addNewComplaint(complaintData);
    expect(result.status).toBe(false);
    expect(result.message).toBe('Response could not be submitted, please try again!');
  });

  // Test for getAllComplaints method
  it('should get all complaints', async () => {
    const mockComplaints = [
      { id: 1, problem: 'Issue 1', resolved: false },
      { id: 2, problem: 'Issue 2', resolved: true },
    ];

    contactUs.find.mockResolvedValue(mockComplaints);

    const result = await getAllComplaints();
    expect(result.status).toBe(true);
    expect(result.result).toEqual(mockComplaints);
  });

  // Test for markAsResolved method
  it('should mark a complaint as resolved', async () => {
    const complaintId = 1;
    const mockComplaint = { id: complaintId, resolved: false };

    contactUs.findOne.mockResolvedValue(mockComplaint);
    contactUs.updateOne.mockResolvedValue({ nModified: 1 }); // Assuming complaint is successfully updated

    const result = await markAsResolved(complaintId);
    expect(result.status).toBe(true);
  });

  it('should return false if complaint not found', async () => {
    const complaintId = 1;

    contactUs.findOne.mockResolvedValue(null);

    const result = await markAsResolved(complaintId);
    expect(result.status).toBe(false);
  });

});
