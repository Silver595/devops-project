import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user ? role || 'guest' : 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin access - higher limits applied';
        break;
      case 'user':
        limit = 10;
        message = 'User access - standard limits applied';
        break;
      case 'guest':
        limit = 5;
        message = 'Guest access - stricter limits applied';
        break;
    }
    const client = aj.withRule(slidingWindow({mode: 'LIVE',interval:'1m',max: limit,name: `Rate limit for ${role}`}));

    const decision = await client.protect(req);

    if(!decision.allow && decision.reason.isBot()) {
      logger.warn('Bot detected and blocked', { ip: req.ip, userAgent: req.headers['user-agent'] });
      return res.status(403).json({ error: 'Access denied', message: 'Bot traffic is not allowed' });
    }
    if(!decision.allow && decision.reason.isShield()) {
      logger.warn('Shield detected and blocked', { ip: req.ip, userAgent: req.headers['user-agent'],method:req.method });
      return res.status(403).json({ error: 'Access denied', message: 'Shield traffic is not allowed' });
    }
    if(!decision.allow && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', { ip: req.ip, userAgent: req.headers['user-agent'] });
      return res.status(429).json({ error: 'Rate limit exceeded', message: 'Too many requests' });
    }
    next();
  } catch (error) {
    console.error('Arcjet middleware error:', error);

    return res.status(403).json({ error: 'Access denied' });
    //next();
  }
};

export default securityMiddleware;
