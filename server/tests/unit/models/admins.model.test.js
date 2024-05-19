import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import admins from '../../../src/models/admin/admins.mongo.js';
import {
  addNewAdmin,
  authenticateAdmin,
  getAllAdmins,
  deleteAdmin,
  getAdminById,
} from '../../../src/models/admin/admins.model.js';

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

describe('Admin Model Tests', () => {
  it('should add a new admin', async () => {
    const adminData = { newAdminId: "10", email: 'admin@example.com', password: 'password', firstName: 'admin', lastName: 'last' };
    const result = await addNewAdmin(adminData);

    expect(result.status).toBe(true);
    expect(result.message).toBe('Admin created successfully!');

    const admin = await admins.findOne({ email: adminData.email });
    expect(admin).not.toBeNull();
    expect(admin.email).toBe(adminData.email);
  });

  it('should not add a duplicate admin', async () => {
    const adminData = { newAdminId: "10", email: 'admin@example.com', password: 'password', firstName: 'admin', lastName: 'last' };
    await addNewAdmin(adminData);

    const result = await addNewAdmin(adminData);
    expect(result.status).toBe(false);
    expect(result.message).toBe('Admin already exists!');
  });

  it('should authenticate an admin with correct credentials', async () => {
    const adminData = { newAdminId: "10", email: 'admin@example.com', password: 'password', firstName: 'admin', lastName: 'last' };
    await addNewAdmin(adminData);

    const result = await authenticateAdmin(adminData);
    expect(result.status).toBe(true);
    expect(result.message).toBe('Admin verified successfully!');
  });

  it('should not authenticate an admin with incorrect password', async () => {
    const adminData = { newAdminId: "10", email: 'admin@example.com', password: 'password', firstName: 'admin', lastName: 'last' };
    await addNewAdmin(adminData);

    const result = await authenticateAdmin({ email: adminData.email, password: 'wrongpassword' });
    expect(result.status).toBe(false);
    expect(result.message).toBe('Incorrect Password!');
  });

  it('should not authenticate a non-existent admin', async () => {
    const adminData = { newAdminId: "10", email: 'admin@example.com', password: 'password', firstName: 'admin', lastName: 'last' };

    const result = await authenticateAdmin(adminData);
    expect(result.status).toBe(false);
    expect(result.message).toBe('Admin not found!');
  });

  it('should get all admins', async () => {
    const adminData1 = { newAdminId: "11", email: 'admin2@example.com', password: 'password', firstName: 'admin', lastName: 'last' };
    const adminData2 = { newAdminId: "12", email: 'admin3@example.com', password: 'password', firstName: 'admin', lastName: 'last' };
    await addNewAdmin(adminData1);
    await addNewAdmin(adminData2);

    const result = await getAllAdmins();
    expect(result.status).toBe(true);
    expect(result.result.length).toBe(2);
  });

  it('should delete an admin by id', async () => {
    const adminData = { newAdminId: "10", email: 'admin@example.com', password: 'password', firstName: 'admin', lastName: 'last' };
    await addNewAdmin(adminData);
    const admin = await admins.findOne({ email: adminData.email });

    const result = await deleteAdmin(admin.newAdminId);
    expect(result.status).toBe(true);

    const deletedAdmin = await admins.findOne({ _id: admin.newAdminId });
    expect(deletedAdmin).toBeNull();
  });

  it('should get an admin by id', async () => {
    const adminData = { newAdminId: "13", email: 'admin4@example.com', password: 'password', firstName: 'admin', lastName: 'last' };
    await addNewAdmin(adminData);
    const admin = await admins.findOne({ email: adminData.email });

    const result = await getAdminById(admin.id);
    expect(result.status).toBe(true);
    expect(result.result.email).toBe(adminData.email);
  });
});
