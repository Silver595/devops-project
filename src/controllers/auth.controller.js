import logger from '#config/logger.js';
import { registerSchema } from '#validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';

export const register = async (req, res, next) => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation error',
        details: formatValidationError(validationResult.error),
      });
    }
    const { name, email, role } = validationResult.data;

    logger.info(`User registered successfully: ${email} with role ${role}`);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: 1,
        name,
        email,
        role,
      },
    });
  } catch (error) {
    logger.error('register error', error);
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
  } catch (error) {
    logger.error('login error', error);
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }
  }
};
