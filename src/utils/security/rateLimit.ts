import { RateLimiter } from './types';

const rateLimiters: Map<string, RateLimiter> = new Map();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limiter = rateLimiters.get(ip) || { count: 0, timestamp: now };

  // Reset counter if more than a minute has passed
  if (now - limiter.timestamp > 60000) {
    limiter.count = 0;
    limiter.timestamp = now;
  }

  // Allow max 30 requests per minute
  if (limiter.count >= 30) {
    return false;
  }

  limiter.count++;
  rateLimiters.set(ip, limiter);
  return true;
}