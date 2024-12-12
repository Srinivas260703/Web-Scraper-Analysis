export function validateUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.protocol) {
      return `https://${url}`;
    }
    return url;
  } catch {
    throw new Error('Invalid URL format. Please enter a valid website URL.');
  }
}

export function validateResponse(response: any) {
  if (!response || !response.data) {
    throw new Error('Invalid response from server');
  }
  return response;
}