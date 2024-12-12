import React, { useState } from 'react';
import { Search, AlertTriangle, Globe } from 'lucide-react';
import { ErrorDisplay } from './ErrorDisplay';

interface ScrapeFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export const ScrapeForm: React.FC<ScrapeFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let processedUrl = url.trim();
    if (!processedUrl) {
      setError('Please enter a URL');
      return;
    }

    // Add protocol if missing
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }

    try {
      new URL(processedUrl);
      onSubmit(processedUrl);
    } catch {
      setError('Please enter a valid URL (e.g., example.com)');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Globe className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g., example.com)"
          className="w-full pl-10 pr-24 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Analyze</span>
            </>
          )}
        </button>
      </div>
      
      {error && (
        <ErrorDisplay 
          message={error} 
          onDismiss={() => setError('')}
        />
      )}
    </form>
  );
};