export interface RateLimiter {
  count: number;
  timestamp: number;
}

export interface SecurityConfig {
  maxRequestsPerMinute: number;
  cacheDuration: number;
  proxyTimeout: number;
  maxRedirects: number;
  allowedContentTypes: string[];
  maxContentLength: number;
}

export interface SecurityHeaders {
  'Content-Security-Policy'?: string;
  'X-Frame-Options'?: string;
  'X-Content-Type-Options'?: string;
  'Strict-Transport-Security'?: string;
  'X-XSS-Protection'?: string;
  'Referrer-Policy'?: string;
}