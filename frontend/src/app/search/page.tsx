'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchPhotos, PhotoListResponse } from '@/lib/api';
import PhotoGrid from '@/components/PhotoGrid';
import Navbar from '@/components/Navbar';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<PhotoListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    
    setSearchQuery(query);
    setSearchTags(tags);
    
    if (query || tags.length > 0) {
      performSearch(query, tags);
    }
  }, [searchParams]);

  const performSearch = async (query: string, tags: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchPhotos(1, 20, query || undefined, tags.length > 0 ? tags : undefined);
      setSearchResults(response);
    } catch (err) {
      setError('Failed to search photos');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchTags.length > 0) params.set('tags', searchTags.join(','));
    window.history.pushState({}, '', `/search?${params}`);
    performSearch(searchQuery, searchTags);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Search Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Search Results
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleNewSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl leading-6 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-300"
                  placeholder="Search for green cities, solar panels, sustainable living..."
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-6 flex items-center"
                >
                  <div className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-medium transition-colors duration-200">
                    Search
                  </div>
                </button>
              </div>
            </form>
            
            {/* Search Info */}
            {searchResults && (
              <div className="mt-6 text-gray-600">
                {searchQuery && (
                  <p className="mb-2">
                    Showing results for: <span className="font-semibold text-gray-900">"{searchQuery}"</span>
                  </p>
                )}
                {searchTags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-2">
                    <span>Tags: </span>
                    {searchTags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm">
                  Found {searchResults.total} {searchResults.total === 1 ? 'image' : 'images'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-16">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={() => performSearch(searchQuery, searchTags)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}
          
          {searchResults && !loading && (
            <PhotoGrid
              initialPhotos={searchResults.items}
              initialTotal={searchResults.total}
              initialPage={searchResults.page}
              initialPages={searchResults.pages}
              searchQuery={searchQuery}
              searchTags={searchTags}
            />
          )}
          
          {searchResults && searchResults.items.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or browse our featured images
                </p>
                <a
                  href="/"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Browse All Images
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}