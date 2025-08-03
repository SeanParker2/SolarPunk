'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchCollections, Collection } from '@/lib/api';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const response = await fetchCollections();
        setCollections(response.items);
      } catch (error) {
        console.error('Error loading collections:', error);
        setError('Failed to load collections');
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, []);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background-primary">
        <Navbar onSearch={handleSearch} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background-primary">
        <Navbar onSearch={handleSearch} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-dark">
      <Navbar onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="py-20 bg-background-dark relative overflow-hidden">
        {/* 背景效果 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background-secondary/10 to-background-dark" />
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-1 h-20 bg-gradient-to-b from-primary-glow to-accent-glow" />
              <div>
                <span className="text-accent-glow font-mono text-sm tracking-wider block mb-2">// VISUAL_STORIES</span>
                <h1 className="text-6xl lg:text-7xl font-display font-black text-white leading-none">
                  主题
                  <span className="block text-primary-glow animate-glow-pulse">策展</span>
                </h1>
              </div>
              <div className="w-1 h-20 bg-gradient-to-b from-accent-glow to-primary-glow" />
            </div>
            <p className="text-xl font-mono text-primary-200 leading-relaxed max-w-3xl mx-auto">
              &gt; 探索精心策划的太阳朋克主题合集_
              <br />
              &gt; 每个故事都是对未来的一次深度思考_
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20 bg-background-dark relative">
        <div className="max-w-7xl mx-auto px-6">
          {collections.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">暂无主题合集</h3>
              <p className="text-primary-200 mb-8">精彩的主题策展正在筹备中，敬请期待...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  onClick={() => router.push(`/collections/${collection.slug}`)}
                  className="group cursor-pointer bg-background-secondary/20 backdrop-blur-sm border border-primary-200/20 rounded-2xl overflow-hidden hover:border-primary-glow/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-glow/20 hover:-translate-y-2"
                >
                  {/* Cover Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary-200/20 to-accent-200/20 relative overflow-hidden">
                    {collection.cover_photo ? (
                      <img
                        src={collection.cover_photo.thumbnail_url}
                        alt={collection.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Stats */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <div className="bg-background-dark/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-mono text-primary-200">{collection.photo_count} 图片</span>
                      </div>
                      <div className="bg-background-dark/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-mono text-accent-200">{collection.view_count} 浏览</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-primary-glow transition-colors duration-300">
                      {collection.title}
                    </h3>
                    {collection.description && (
                      <p className="text-primary-200 text-sm leading-relaxed mb-4 line-clamp-3">
                        {collection.description}
                      </p>
                    )}
                    
                    {/* Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-accent-glow tracking-wider">
                        探索主题 →
                      </span>
                      <div className="w-8 h-8 rounded-full bg-primary-glow/20 flex items-center justify-center group-hover:bg-primary-glow/40 transition-colors duration-300">
                        <svg className="w-4 h-4 text-primary-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}