import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import users from '../../../src/models/users/users.mongo.js';
import {
  addNewUser,
  authenticateUser,
  getAllUsers,
  deleteUser,
  getUserById,
} from '../../../src/models/users/users.model.js';

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

describe('User Model Tests', () => {
  it('should add a new user', async () => {
    const userData = { email: 'user@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
    const result = await addNewUser(userData);

    expect(result.status).toBe(true);
    expect(result.message).toBe('User created successfully!');

    const user = await users.findOne({ email: userData.email });
    expect(user).not.toBeNull();
    expect(user.email).toBe(userData.email);
  });

  it('should not add a duplicate user', async () => {
    const userData = { email: 'user@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
    await addNewUser(userData);

    const result = await addNewUser(userData);
    expect(result.status).toBe(false);
    expect(result.message).toBe('User already exists!');
  });

  it('should authenticate a user with correct credentials', async () => {
    const userData = { email: 'user@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
    await addNewUser(userData);

    const result = await authenticateUser(userData);
    expect(result.status).toBe(true);
    expect(result.message).toBe('User verified successfully!');
  });

  it('should not authenticate a user with incorrect password', async () => {
    const userData = { email: 'user@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
    await addNewUser(userData);

    const result = await authenticateUser({ email: userData.email, password: 'wrongpassword' });
    expect(result.status).toBe(false);
    expect(result.message).toBe('Incorrect Password!');
  });

  it('should not authenticate a non-existent user', async () => {
    const userData = { email: 'user@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };

    const result = await authenticateUser(userData);
    expect(result.status).toBe(false);
    expect(result.message).toBe('User not found!');
  });

  it('should get all users', async () => {
    const userData1 = { email: 'user2@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
    const userData2 = { email: 'user3@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
    await addNewUser(userData1);
    await addNewUser(userData2);

    const result = await getAllUsers();
    expect(result.status).toBe(true);
    expect(result.result.length).toBe(2);
  });

  it('should delete a user by id', async () => {
    const userData = { email: 'user@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
    await addNewUser(userData);
    const user = await users.findOne({ email: userData.email });

    const result = await deleteUser(user.id);
    expect(result.status).toBe(true);
    expect(result.message).toBe('User deleted successfully!');

    const deletedUser = await users.findOne({ id: user.id });
    expect(deletedUser).toBeNull();
  });

  it('should get a user by id', async () => {
    const userData = { email: 'user4@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
    await addNewUser(userData);
    const user = await users.findOne({ email: userData.email });

    const result = await getUserById(user.id);
    expect(result.status).toBe(true);
    expect(result.result.email).toBe(userData.email);
  });
});
