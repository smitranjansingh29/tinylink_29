'use client';

import { useState, useEffect } from 'react';
import { Copy, Trash2, ExternalLink } from 'lucide-react';

interface Link {
  code: string;
  target_url: string;
  clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

interface LinksTableProps {
  refresh: number;
  onRefreshComplete: () => void;
}

export default function LinksTable({ refresh, onRefreshComplete }: LinksTableProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLinks();
  }, [refresh]);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
      onRefreshComplete();
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLinks(links.filter(link => link.code !== code));
      } else {
        alert('Failed to delete link');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Error deleting link');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredLinks = links.filter(link =>
    link.code.toLowerCase().includes(search.toLowerCase()) ||
    link.target_url.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Your Links</h2>
          <input
            type="text"
            placeholder="Search by code or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          {links.length === 0 ? 'No links created yet' : 'No links match your search'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Short Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Clicked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLinks.map((link) => (
                <tr key={link.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-600">
                        {link.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/${link.code}`)}
                                  className="text-gray-400 hover:text-gray-600"
                                  title='new'
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 max-w-md">
                      <span className="text-sm text-gray-900 truncate">
                        {link.target_url}
                      </span>
                      <a
                        href={link.target_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {link.last_clicked_at
                      ? new Date(link.last_clicked_at).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(link.code)}
                              className="text-red-600 hover:text-red-900"
                              title='new'
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}