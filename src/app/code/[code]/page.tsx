import { notFound } from 'next/navigation';
import Header from '../../../../components/Header';


interface PageProps {
  params: Promise<{ code: string }>; // ← Add Promise wrapper
}

export default async function StatsPage({ params }: PageProps) {
  const { code } = await params; // ← AWAIT the params

  let linkData = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/links/${code}`, {
      next: { revalidate: 30 }
    });
    
    if (response.ok) {
      linkData = await response.json();
    }
  } catch (error) {
    console.error('Error fetching link data:', error);
  }

  if (!linkData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Stats for: {code}
            </h1>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Total Clicks</h3>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {linkData.clicks}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Created</h3>
                <p className="text-lg font-semibold text-green-900 mt-2">
                  {new Date(linkData.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800">Last Clicked</h3>
                <p className="text-lg font-semibold text-purple-900 mt-2">
                  {linkData.last_clicked_at 
                    ? new Date(linkData.last_clicked_at).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Destination URL</h3>
              <p className="text-gray-600 break-all bg-gray-50 p-3 rounded-md">
                {linkData.target_url}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Short Link</h3>
              <p className="text-blue-600 break-all bg-blue-50 p-3 rounded-md">
                {process.env.NEXT_PUBLIC_APP_URL}/{code}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
