import { api } from './api/config';
import { getProxyUrl } from './api/proxy';
import { validateUrl, validateResponse } from './scraping/validator';
import { parseHtml } from './scraping/parser';
import { analyzeWebsite } from './analyzer';
import { checkRateLimit } from './security/rateLimit';
import { getCachedData, setCacheData } from './security/cache';
import { validateContentType, validateContentLength, validateRedirects } from './security/validator';
import type { ScrapeResult } from '../types';
import type { ProxyConfig } from './types/proxy';

export async function scrapeWebsite(url: string, clientIp: string): Promise<ScrapeResult> {
  try {
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Validate and normalize URL
    const validUrl = validateUrl(url);
    
    // Check cache
    const cachedResult = getCachedData(validUrl);
    if (cachedResult) {
      return cachedResult;
    }

    // Try direct request first
    try {
      const response = await api.get(validUrl, {
        maxRedirects: 5,
        validateStatus: status => status >= 200 && status < 300
      });

      // Validate response
      if (!validateContentType(response.headers['content-type'])) {
        throw new Error('Invalid content type');
      }

      if (!validateContentLength(parseInt(response.headers['content-length'] || '0'))) {
        throw new Error('Content too large');
      }

      if (!validateRedirects(response.request?.res?.responseUrl ? 1 : 0)) {
        throw new Error('Too many redirects');
      }

      const parsedData = parseHtml(response.data, response.headers);
      const threats = await analyzeWebsite({
        url: validUrl,
        ...parsedData
      });

      const result = {
        url: validUrl,
        data: [parsedData],
        threats,
        timestamp: new Date().toISOString()
      };

      // Cache the result
      setCacheData(validUrl, result);

      return result;
    } catch (directError) {
      // If direct request fails, try with proxy
      console.log('Direct request failed, trying proxy...');
      
      const proxyConfig: ProxyConfig = { type: 'allOrigins' };
      const proxyUrl = getProxyUrl(validUrl, proxyConfig);
      
      const response = await api.get(proxyUrl, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        maxRedirects: 5
      });

      // Validate proxy response
      if (!validateContentType(response.headers['content-type'])) {
        throw new Error('Invalid content type from proxy');
      }

      const parsedData = parseHtml(response.data, response.headers);
      const threats = await analyzeWebsite({
        url: validUrl,
        ...parsedData
      });

      const result = {
        url: validUrl,
        data: [parsedData],
        threats,
        timestamp: new Date().toISOString()
      };

      // Cache the result
      setCacheData(validUrl, result);

      return result;
    }
  } catch (error) {
    if (error.response) {
      throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Unable to reach the website. Please check your internet connection and try again.');
    } else {
      throw new Error(error.message || 'An error occurred while analyzing the website.');
    }
  }
}