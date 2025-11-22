'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import LinkForm from '../../components/LinkForm';
import LinksTable from '../../components/LinksTable';

export default function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLinkCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRefreshComplete = () => {
    // Refresh complete, can be used for additional logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">URL Shortener</h1>
          <p className="mt-2 text-gray-600">Create short links and track their performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LinkForm onLinkCreated={handleLinkCreated} />
          </div>
          
          <div className="lg:col-span-2">
            <LinksTable 
              refresh={refreshTrigger} 
              onRefreshComplete={handleRefreshComplete}
            />
          </div>
        </div>
      </main>
    </div>
  );
}