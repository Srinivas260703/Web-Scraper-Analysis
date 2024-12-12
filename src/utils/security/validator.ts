import { SecurityConfig } from './types';

const defaultConfig: SecurityConfig = {
  maxRequestsPerMinute: 30,
  cacheDuration: 300000,
  proxyTimeout: 15000,
  maxRedirects: 5,
  allowedContentTypes: [
    'text/html',
    'application/xhtml+xml',
    'application/xml'
  ],
  maxContentLength: 5 * 1024 * 1024 // 5MB
};

export function validateContentType(contentType: string): boolean {
  return defaultConfig.allowedContentTypes.some(allowed => 
    contentType.toLowerCase().includes(allowed)
  );
}

export function validateContentLength(length: number): boolean {
  return length <= defaultConfig.maxContentLength;
}

export function validateRedirects(redirectCount: number): boolean {
  return redirectCount <= defaultConfig.maxRedirects;
}