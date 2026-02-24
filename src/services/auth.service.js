import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import db from '#config/database.js';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    logger.error('hashPassword error', error);
    throw new Error('Failed to hash password');
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = db.select().from(users).where(eq(users.email,email)).limit(1);
    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password:hashedPassword,
      role,
    }).returning({id:users.id,name:users.name,email:users.email,role:users.role,createdAt:users.created_at});
    logger.info('User created successfully');
    return newUser;
  } catch (error) {
    logger.error('error creating user', error);
    throw error;
  }
};
