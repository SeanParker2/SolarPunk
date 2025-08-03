// frontend/src/components/PhotoGrid.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Photo, fetchPhotos } from '@/lib/api';
import PhotoModal from './PhotoModal';
import { ArrowDownTrayIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface PhotoGridProps {
  initialPhotos: Photo[];
  initialTotal: number;
  initialPage: number;
  initialPages: number;
  searchQuery?: string;
  searchTags?: string[];
}

export default function PhotoGrid({ initialPhotos, initialTotal, initialPage, initialPages, searchQuery, searchTags }: PhotoGridProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialPages);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPhotoElementRef = useRef<HTMLDivElement | null>(null);
  const animationObserverRef = useRef<IntersectionObserver | null>(null);

  // 当搜索参数变化时重置状态
  useEffect(() => {
    setPhotos(initialPhotos);
    setCurrentPage(initialPage);
    setTotalPages(initialPages);
  }, [initialPhotos, initialPage, initialPages, searchQuery, searchTags]);

  const loadMorePhotos = useCallback(async () => {
    if (loading || currentPage >= totalPages) return;

    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetchPhotos(nextPage, 20, searchQuery, searchTags);
      setPhotos(prev => [...prev, ...response.items]);
      setCurrentPage(nextPage);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Error loading more photos:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, currentPage, totalPages, searchQuery, searchTags]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages && !loading) {
          loadMorePhotos();
        }
      },
      { threshold: 0.1 }
    );
    
    if (lastPhotoElementRef.current) {
      observerRef.current.observe(lastPhotoElementRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMorePhotos, currentPage, totalPages, loading]);

  // 动画观察器
  useEffect(() => {
    if (animationObserverRef.current) animationObserverRef.current.disconnect();
    
    animationObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const photoId = entry.target.getAttribute('data-photo-id');
            if (photoId) {
              setVisibleImages(prev => new Set([...prev, photoId]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    return () => {
      if (animationObserverRef.current) {
        animationObserverRef.current.disconnect();
      }
    };
  }, [photos]);

  const handlePhotoClick = (publicId: string) => {
    setSelectedPhotoId(publicId);
  };

  const handleCloseModal = () => {
    setSelectedPhotoId(null);
  };

  const handleDownload = (downloadUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleLike = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(photoId)) {
        newLiked.delete(photoId);
      } else {
        newLiked.add(photoId);
      }
      return newLiked;
    });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Photo Grid - 都市规划式布局 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
          {photos.map((photo, index) => {
            const isVisible = visibleImages.has(photo.public_id);
            const isLoaded = loadedImages.has(photo.public_id);
            const isLiked = likedPhotos.has(photo.public_id);
            // 都市规划式大小变化
            const sizeVariants = [
              'col-span-1 row-span-1', // 标准
              'col-span-2 row-span-1', // 宽
              'col-span-1 row-span-2', // 高
              'col-span-2 row-span-2', // 大
            ];
            const sizeClass = sizeVariants[index % 4];
            
            return (
            <div
              key={photo.public_id}
              ref={(el) => {
                if (index === photos.length - 1) lastPhotoElementRef.current = el;
                if (el && animationObserverRef.current) {
                  animationObserverRef.current.observe(el);
                }
              }}
              data-photo-id={photo.public_id}
              className={`group cursor-pointer relative overflow-hidden bg-background-secondary border-2 border-primary-glow/20 hover:border-accent-glow hover:shadow-cyber transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] ${
                sizeClass
              } ${
                isVisible ? 'animate-scroll-fade-in' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                animationDelay: `${(index % 8) * 100}ms`,
                clipPath: index % 7 === 0 ? 'polygon(0 0, 95% 0, 100% 100%, 5% 100%)' : 'none'
              }}
              onClick={() => handlePhotoClick(photo.public_id)}
            >
              {/* 装饰性边框 */}
              <div className="absolute -inset-px bg-gradient-to-br from-primary-glow via-accent-glow to-neon-cyan opacity-0 group-hover:opacity-60 transition-opacity duration-300 animate-glow-pulse" />
              
              {/* Image Container */}
              <div className="relative overflow-hidden">
                {/* 扫描线加载效果 */}
                 {!isLoaded && (
                   <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-primary-900/50 to-background-dark">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-glow/30 to-transparent animate-scan-line"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <div className="text-primary-glow font-mono text-xs tracking-wider animate-terminal-blink">LOADING...</div>
                     </div>
                   </div>
                 )}
                 
                 <img
                   src={photo.thumbnail_url}
                   alt={photo.title}
                   style={{ 
                     aspectRatio: photo.aspect_ratio,
                     opacity: isLoaded ? 1 : 0
                   }}
                   className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 bg-background-dark filter group-hover:brightness-110 group-hover:contrast-110"
                   loading="lazy"
                   onLoad={() => setLoadedImages(prev => new Set([...prev, photo.public_id]))}
                 />
                
                {/* 故障艺术效果 */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-80 animate-cyber-flicker" />
                  <div className="absolute bottom-0 right-0 w-2/3 h-px bg-gradient-to-l from-transparent via-accent-glow to-transparent opacity-60" />
                </div>
                
                {/* 赛博朋克扫描框 */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {/* 四角扫描线 */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary-glow animate-glow-pulse" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary-glow animate-glow-pulse" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary-glow animate-glow-pulse" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary-glow animate-glow-pulse" />
                  
                  {/* 数据覆盖层 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-background-dark/40" />
                  
                  {/* 扫描线效果 */}
                  <div className="absolute top-0 left-0 w-full h-px bg-primary-glow animate-scan-line" />
                </div>
                
                {/* Action Buttons - 增强Punk风格 */}
                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                  <button
                    className={`relative bg-background-dark/90 backdrop-blur-md border transition-all duration-300 hover:scale-110 p-2 group/btn overflow-hidden ${
                      isLiked 
                        ? 'border-accent-glow text-accent-glow shadow-glow-accent' 
                        : 'border-primary-glow/50 text-primary-glow hover:text-accent-glow shadow-cyber hover:shadow-glow-primary'
                    }`}
                    style={{clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)'}}
                    onClick={(e) => toggleLike(photo.public_id, e)}
                  >
                    {isLiked ? (
                      <HeartSolidIcon className="h-4 w-4 relative z-10 animate-pulse" />
                    ) : (
                      <HeartIcon className="h-4 w-4 relative z-10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/20 to-accent-glow/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                  </button>
                  <button
                    className="relative bg-background-dark/90 backdrop-blur-md border border-primary-glow/50 p-2 shadow-cyber hover:shadow-glow-primary transition-all duration-300 hover:scale-110 text-primary-glow hover:text-accent-glow group/btn overflow-hidden"
                    style={{clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(photo.thumbnail_url, `${photo.title}.webp`);
                    }}
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/20 to-accent-glow/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                  </button>
                </div>

                {/* 终端风格数据显示 - 增强Punk效果 */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <div className="relative bg-background-dark/95 backdrop-blur-md border border-primary-glow/30 p-3" style={{clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)'}}>
                    {/* 装饰性角标 */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-glow opacity-60" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-glow opacity-60" />
                    
                    <div className="font-mono text-xs text-primary-glow mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-accent-glow">&gt;</span>
                        <span className="truncate tracking-wider">{photo.title}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="text-neon-cyan">VIEWS: {Math.floor(Math.random() * 1000) + 100}</span>
                          <span className="text-neon-green">LIKES: {Math.floor(Math.random() * 50) + 10}</span>
                        </div>
                        <div className="text-accent-glow animate-terminal-blink">█</div>
                      </div>
                    </div>
                    {photo.tags && photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.slice(0, 3).map((tag, i) => (
                          <span 
                            key={i} 
                            className="text-xs bg-primary-glow/20 text-primary-glow px-2 py-0.5 border border-primary-glow/30 font-mono tracking-wide hover:border-accent-glow hover:text-accent-glow transition-colors duration-200"
                            style={{
                              clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)',
                              animationDelay: `${i * 0.1}s`
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* 数据流装饰 */}
                    <div className="absolute -bottom-1 left-0 w-full flex justify-center space-x-1 opacity-40">
                      {Array.from({length: 6}).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-px bg-gradient-to-t from-primary-glow to-transparent" 
                          style={{
                            height: `${Math.random() * 4 + 2}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-primary-glow/30 border-t-primary-glow animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-2 border-accent-glow/30 border-b-accent-glow animate-spin" style={{animationDirection: 'reverse'}} />
            </div>
            <div className="text-center">
              <div className="font-mono text-primary-glow text-sm tracking-wider mb-1">
                &gt; LOADING_MORE_DATA...
                <span className="animate-terminal-blink">█</span>
              </div>
              <div className="text-xs text-primary-300 font-mono">// 探索更多赛博朋克世界</div>
            </div>
          </div>
        </div>
      )}

      {currentPage >= totalPages && photos.length > 0 && (
        <div className="text-center py-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-primary-glow flex items-center justify-center bg-background-dark shadow-glow-primary">
                <span className="text-2xl animate-glow-pulse">⚡</span>
              </div>
              <div className="absolute -inset-2 border border-accent-glow/30 animate-glow-pulse" />
            </div>
            <div className="space-y-2">
              <div className="font-mono text-primary-glow text-sm tracking-wider">
                &gt; DATA_STREAM_COMPLETE
              </div>
              <div className="text-xs text-primary-300 font-mono">
                // 所有数据已加载完成
                <br />
                // 继续探索无限可能
              </div>
            </div>
          </div>
        </div>
      )}

      <PhotoModal 
        publicId={selectedPhotoId} 
        onClose={handleCloseModal} 
      />
    </>
  );
}