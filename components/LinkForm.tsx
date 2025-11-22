'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface LinkFormProps {
  onLinkCreated: () => void;
}

export default function LinkForm({ onLinkCreated }: LinkFormProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUrl, customCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create link');
      }

      setTargetUrl('');
      setCustomCode('');
      onLinkCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="space-y-4">
        <div>
          <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700">
            Destination URL *
          </label>
          <input
            type="url"
            id="targetUrl"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="customCode" className="block text-sm font-medium text-gray-700">
            Custom Code (optional)
          </label>
          <input
            type="text"
            id="customCode"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="my-link"
            pattern="[A-Za-z0-9]{6,8}"
            title="6-8 alphanumeric characters"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            6-8 alphanumeric characters. Leave empty for auto-generation.
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !targetUrl}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          {loading ? 'Creating...' : 'Create Short Link'}
        </button>
      </div>
    </form>
  );
}