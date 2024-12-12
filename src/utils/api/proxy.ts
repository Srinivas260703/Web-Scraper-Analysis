import type { ProxyConfig } from '../types/proxy';

const CORS_PROXIES = {
  corsAnywhere: 'https://cors-anywhere.herokuapp.com/',
  allOrigins: 'https://api.allorigins.win/raw?url=',
};

export function getProxyUrl(url: string, config: ProxyConfig = { type: 'allOrigins' }): string {
  const proxy = CORS_PROXIES[config.type];
  return `${proxy}${encodeURIComponent(url)}`;
}