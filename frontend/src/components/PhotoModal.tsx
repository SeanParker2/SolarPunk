// frontend/src/components/PhotoModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { PhotoDetail, fetchPhotoDetail, Photo } from '@/lib/api';
import { XMarkIcon, ArrowDownTrayIcon, HeartIcon, ShareIcon, EyeIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

interface PhotoModalProps {
  publicId?: string | null;
  photo?: Photo | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  showNavigation?: boolean;
}

export default function PhotoModal({ publicId, photo, onClose, onPrev, onNext, showNavigation = false }: PhotoModalProps) {
  const [photoDetail, setPhotoDetail] = useState<PhotoDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // If photo is provided directly, use it as photoDetail
  useEffect(() => {
    if (photo) {
      setPhotoDetail({
        public_id: photo.public_id,
        title: photo.title,
        tags: photo.tags,
        download_url: photo.thumbnail_url, // Use thumbnail_url as fallback
        aspect_ratio: photo.aspect_ratio,
        license: "Free to use under SolarPunk License (CC0)."
      });
      return;
    }
  }, [photo]);

  useEffect(() => {
    if (!publicId) {
      setPhotoDetail(null);
      return;
    }

    const loadPhotoDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const detail = await fetchPhotoDetail(publicId);
        setPhotoDetail(detail);
      } catch (err) {
        setError('Failed to load photo details');
        console.error('Error loading photo detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPhotoDetail();
  }, [publicId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (publicId || photo) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [publicId, photo, onClose]);

  if (!publicId && !photo) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (photoDetail) {
      const link = document.createElement('a');
      link.href = photoDetail.download_url;
      link.download = `${photoDetail.public_id}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (photoDetail && navigator.share) {
      try {
        await navigator.share({
          title: photoDetail.title,
          text: `Check out this amazing Solarpunk image: ${photoDetail.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleTagClick = (tag: string) => {
    onClose();
    router.push(`/search?tags=${encodeURIComponent(tag)}`);
  };

  return (
    <div 
      className="modal-overlay animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-accent-500/80 hover:text-gray-900 smooth-transition">
                <HeartIcon className="h-6 w-6 text-white" />
              </button>
              <button 
                onClick={handleShare}
                className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-accent-500/80 hover:text-gray-900 smooth-transition"
              >
                <ShareIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-red-500/80 smooth-transition"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-96 bg-background-primary">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-accent-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-96 bg-background-primary">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4 animate-scale-in">
                <XMarkIcon className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-red-600 text-lg font-medium animate-fade-in">{error}</p>
              <button onClick={() => setError(null)} className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 smooth-transition animate-fade-in">重试</button>
            </div>
          </div>
        )}

        {photoDetail && (
          <div className="flex flex-col lg:flex-row h-full">
            {/* Image Section - 70% */}
            <div className="lg:w-[70%] relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <img
                src={photoDetail.download_url}
                alt={photoDetail.title}
                className="w-full h-auto max-h-[90vh] object-contain animate-scale-in"
                style={{ aspectRatio: photoDetail.aspect_ratio }}
              />
              
              {/* Navigation Buttons */}
              {showNavigation && (
                <>
                  {onPrev && (
                    <button
                      onClick={onPrev}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 smooth-transition z-10"
                    >
                      <ChevronLeftIcon className="h-6 w-6 text-white" />
                    </button>
                  )}
                  {onNext && (
                    <button
                      onClick={onNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 smooth-transition z-10"
                    >
                      <ChevronRightIcon className="h-6 w-6 text-white" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Details Sidebar - 30% */}
            <div className="lg:w-[30%] p-8 flex flex-col bg-background-card overflow-y-auto">
              <div className="flex-1 space-y-8">
                <h2 className="text-3xl font-display font-bold text-gray-900 leading-tight animate-fade-in">{photoDetail.title}</h2>
                
                {/* Stats */}
                <div className="flex items-center justify-between p-4 bg-background-primary rounded-xl animate-fade-in">
                  <div className="flex items-center space-x-2 text-primary-600">
                    <EyeIcon className="h-6 w-6" />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">{Math.floor(Math.random() * 5000) + 1000}</span>
                      <span className="text-xs text-gray-500">浏览</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-accent-500">
                    <HeartIcon className="h-6 w-6" />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">{Math.floor(Math.random() * 200) + 50}</span>
                      <span className="text-xs text-gray-500">喜欢</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-forest-500">
                    <ArrowDownTrayIcon className="h-6 w-6" />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">{Math.floor(Math.random() * 100) + 20}</span>
                      <span className="text-xs text-gray-500">下载</span>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">标签</h3>
                  <div className="flex flex-wrap gap-3">
                    {photoDetail.tags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => handleTagClick(tag)}
                        className="tag-outline animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* License */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">许可协议</h3>
                  <div className="bg-gradient-to-r from-primary-50 to-forest-50 border border-primary-200 rounded-xl p-5 animate-fade-in">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-3 h-3 bg-accent-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-primary-800 font-semibold">基于 Solarpunk License (CC0)</p>
                    </div>
                    <p className="text-xs text-primary-600 ml-6">自由用于商业目的，无需署名</p>
                  </div>
                </div>
              </div>
              
              {/* Download Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleDownload}
                  className="btn-primary-clip w-full flex items-center justify-center gap-3 py-4 shadow-lg hover:shadow-glow animate-fade-in"
                >
                  <ArrowDownTrayIcon className="h-6 w-6" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">免费下载</span>
                    <span className="text-xs opacity-90">3840×2160px • 4.5MB</span>
                  </div>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="btn-secondary flex flex-col items-center justify-center gap-1 py-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <span className="text-sm font-semibold">小尺寸</span>
                    <span className="text-xs opacity-70">1280×720px</span>
                  </button>
                  <button className="btn-secondary flex flex-col items-center justify-center gap-1 py-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <span className="text-sm font-semibold">大尺寸</span>
                    <span className="text-xs opacity-70">1920×1080px</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}