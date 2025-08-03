'use client';

import React, { useState, useEffect } from 'react';
import { fetchPhotos, PhotoListResponse } from '@/lib/api';
import PhotoGrid from '@/components/PhotoGrid';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [photosData, setPhotosData] = useState<PhotoListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadInitialPhotos = async () => {
      try {
        const response = await fetchPhotos(1);
        setPhotosData(response);
      } catch (error) {
        console.error('Error loading photos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialPhotos();
  }, []);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/search?tags=${encodeURIComponent(tag)}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background-primary">
        <Navbar />
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

  if (!photosData) {
    return (
      <main className="min-h-screen bg-background-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4 animate-scale-in">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 animate-fade-in">Failed to load images</h3>
              <p className="text-gray-600 mb-6 animate-fade-in">
                We're having trouble loading the image gallery. Please try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary animate-fade-in"
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
      <HeroSection onSearch={handleSearch} onTagClick={handleTagClick} />
        
        {/* Featured Section */}
        <section className="py-20 bg-background-dark relative">
          {/* 分层背景效果 */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-background-secondary/20 to-background-dark" />
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
            <div className="mb-16">
              {/* 不对称标题布局 */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div className="lg:max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-primary-glow to-accent-glow" />
                    <div>
                      <span className="text-accent-glow font-mono text-sm tracking-wider block mb-2">// FEATURED_COLLECTION</span>
                      <h2 className="text-5xl lg:text-6xl font-display font-black text-white leading-none">
                        精选
                        <span className="block text-primary-glow animate-glow-pulse">作品</span>
                      </h2>
                    </div>
                  </div>
                  <p className="text-lg font-mono text-primary-200 leading-relaxed">
                    &gt; 发现最受欢迎的太阳朋克视觉作品_
                    <br />
                    &gt; 感受未来与自然的完美融合_
                  </p>
                </div>
                
                {/* 统计信息 */}
                 <div className="flex gap-8">
                   <div className="text-center">
                     <div className="text-3xl font-cyber font-bold text-accent-glow">{photosData.items.length}</div>
                     <div className="text-xs font-mono text-primary-300 tracking-wider">IMAGES</div>
                   </div>
                   <div className="text-center">
                     <div className="text-3xl font-cyber font-bold text-primary-glow">∞</div>
                     <div className="text-xs font-mono text-primary-300 tracking-wider">INSPIRATION</div>
                   </div>
                 </div>
              </div>
            </div>
            
            <PhotoGrid 
              initialPhotos={photosData.items}
              initialTotal={photosData.total}
              initialPage={photosData.page}
              initialPages={photosData.pages}
            />
          </div>
        </section>
        
        <Footer />
      </main>
    );
}
