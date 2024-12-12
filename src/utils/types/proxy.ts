export interface ProxyConfig {
  type: 'corsAnywhere' | 'allOrigins';
  options?: {
    timeout?: number;
    headers?: Record<string, string>;
  };
}