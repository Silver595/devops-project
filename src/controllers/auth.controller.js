import logger from '#config/logger.js';
import { loginSchema, registerSchema } from '#validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import {jwtToken} from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const register = async (req, res, next) => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation error',
        details: formatValidationError(validationResult.error),
      });
    }
    const { name, email,password,role } = validationResult.data;

    const user = await createUser({ name, email, password,role });

    const token = jwtToken.sign({ id: user.id, email:user.email, role:user.role });

    cookies.set(res,token, token);

    logger.info(`User registered successfully: ${email} with role ${role}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name:user.name,
        email:user.email,
        role:user.role,
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
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation error',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwtToken.sign({ id: user.id, email: user.email, role: user.role });

    cookies.set(res, 'token', token);

    logger.info(`User logged in successfully: ${email}`);

    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('login error', error);
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User logged out successfully');

    res.status(200).json({
      message: 'User logged out successfully',
    });
  } catch (error) {
    logger.error('logout error', error);
    next(error);
  }
};
