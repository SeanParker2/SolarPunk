'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PhotoModal from '@/components/PhotoModal';
import { fetchCollectionBySlug, CollectionDetail, Photo } from '@/lib/api';

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    
    const loadCollection = async () => {
      try {
        const response = await fetchCollectionBySlug(slug);
        setCollection(response);
      } catch (error) {
        console.error('Error loading collection:', error);
        setError('Failed to load collection');
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [slug]);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handlePhotoClick = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handlePrevPhoto = () => {
    if (!collection) return;
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : collection.photos.length - 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(collection.photos[newIndex]);
  };

  const handleNextPhoto = () => {
    if (!collection) return;
    const newIndex = selectedIndex < collection.photos.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
    setSelectedPhoto(collection.photos[newIndex]);
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

  if (error || !collection) {
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{error || 'Collection not found'}</h3>
              <button
                onClick={() => router.push('/collections')}
                className="btn-primary"
              >
                Back to Collections
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
          {collection.cover_photo && (
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url(${collection.cover_photo.thumbnail_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(100px)'
              }}
            />
          )}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm font-mono">
              <button
                onClick={() => router.push('/collections')}
                className="text-primary-300 hover:text-primary-glow transition-colors duration-300"
              >
                主题策展
              </button>
              <span className="text-primary-500">/</span>
              <span className="text-accent-glow">{collection.title}</span>
            </nav>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-16 bg-gradient-to-b from-primary-glow to-accent-glow" />
                <div>
                  <span className="text-accent-glow font-mono text-sm tracking-wider block mb-2">// COLLECTION</span>
                  <h1 className="text-5xl lg:text-6xl font-display font-black text-white leading-none">
                    {collection.title}
                  </h1>
                </div>
              </div>
              
              {collection.description && (
                <div className="mb-8">
                  <p className="text-lg text-primary-200 leading-relaxed">
                    {collection.description}
                  </p>
                </div>
              )}
              
              {/* Stats */}
              <div className="flex gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-cyber font-bold text-primary-glow">{collection.photos.length}</div>
                  <div className="text-xs font-mono text-primary-300 tracking-wider">IMAGES</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-cyber font-bold text-accent-glow">{collection.view_count}</div>
                  <div className="text-xs font-mono text-primary-300 tracking-wider">VIEWS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-cyber font-bold text-primary-glow">∞</div>
                  <div className="text-xs font-mono text-primary-300 tracking-wider">INSPIRATION</div>
                </div>
              </div>
            </div>
            
            {/* Cover Image */}
            {collection.cover_photo && (
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-200/20 to-accent-200/20 border border-primary-200/20">
                  <img
                    src={collection.cover_photo.thumbnail_url}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-glow/20 to-accent-glow/20 rounded-3xl blur-xl -z-10" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Photos Grid */}
      <section className="py-20 bg-background-dark relative">
        <div className="max-w-7xl mx-auto px-6">
          {collection.photos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">暂无图片</h3>
              <p className="text-primary-200">这个合集还没有添加图片</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {collection.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid group cursor-pointer"
                  onClick={() => handlePhotoClick(photo, index)}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-background-secondary/20 backdrop-blur-sm border border-primary-200/20 hover:border-primary-glow/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-glow/20">
                    <img
                      src={photo.thumbnail_url}
                      alt={photo.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ aspectRatio: photo.aspect_ratio }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">{photo.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {photo.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-xs bg-primary-glow/20 text-primary-glow px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-accent-glow font-mono">
                          {photo.download_count} 下载
                        </span>
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
      
      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={handleCloseModal}
          onPrev={handlePrevPhoto}
          onNext={handleNextPhoto}
          showNavigation={collection.photos.length > 1}
        />
      )}
    </main>
  );
}