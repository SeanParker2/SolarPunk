// frontend/src/components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
      setSearchQuery('');
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <nav className="relative bg-background-card/90 backdrop-blur-md border-b border-primary-glow/30 sticky top-0 z-50 transition-all duration-300">
      {/* 装饰性扫描线 */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-glow to-transparent opacity-60 animate-cyber-flicker" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-glow to-transparent opacity-40" />
      
      {/* 故障艺术装饰 */}
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary-glow/5 to-transparent opacity-50" />
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-accent-glow/5 to-transparent opacity-30" />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo - Punk风格 */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick} 
              className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300 ease-out"
            >
              <div className="relative w-10 h-10 bg-gradient-to-br from-accent-glow to-primary-glow flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 overflow-hidden" style={{clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)'}}>
                <span className="text-white font-bold text-lg font-cyber tracking-wider relative z-10">S</span>
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* 装饰性角标 */}
                <div className="absolute top-0 right-0 w-2 h-2 bg-neon-cyan opacity-60 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-cyber text-white tracking-wider leading-tight">
                  <span className="text-accent-glow">SOLAR</span><span className="text-primary-glow">PUNK</span>
                </h1>
                <div className="flex items-center space-x-1 text-xs font-mono text-primary-300">
                  <span className="text-neon-cyan">[</span>
                  <span>IMAGE_HUB</span>
                  <span className="text-neon-cyan">]</span>
                  <div className="w-1 h-1 bg-accent-glow animate-pulse" />
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar - Desktop - Punk风格 */}
          <div className="hidden md:block flex-1 max-w-md mx-12">
            <form onSubmit={handleSearch} className="relative group">
              {/* 装饰性边框 */}
              <div className="absolute -inset-px bg-gradient-to-r from-primary-glow via-accent-glow to-primary-glow opacity-0 group-hover:opacity-60 transition-opacity duration-300" style={{clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)'}} />
              
              <div className="relative bg-background-secondary border border-primary-glow/30 transition-all duration-300 group-hover:border-accent-glow/50" style={{clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)'}}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                  <MagnifyingGlassIcon className={`h-5 w-5 transition-colors duration-200 ${
                    isSearchFocused ? 'text-accent-glow' : 'text-primary-glow'
                  }`} />
                </div>
                
                {/* 终端风格前缀 */}
                <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                  <span className="text-accent-glow font-mono text-sm">&gt;</span>
                </div>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="block w-full pl-16 pr-4 py-3 bg-transparent text-white placeholder-primary-300 focus:outline-none font-mono text-sm tracking-wide transition-all duration-300"
                  placeholder="SEARCH_QUERY..."
                />
                
                {/* 装饰性角标 */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-neon-cyan opacity-60 animate-pulse" />
                
                {/* 扫描线效果 */}
                {isSearchFocused && (
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-glow to-transparent animate-scan-line" />
                )}
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop - Punk风格 */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => router.push('/collections')}
              className="relative group px-4 py-2 bg-background-secondary border border-primary-glow/30 text-primary-glow hover:text-accent-glow hover:border-accent-glow/50 font-mono text-sm tracking-wide transition-all duration-200 overflow-hidden"
              style={{clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)'}}
            >
              <span className="relative z-10">COLLECTIONS</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/10 to-accent-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
            <button 
              onClick={() => router.push('/')}
              className="relative group px-4 py-2 bg-background-secondary border border-primary-glow/30 text-primary-glow hover:text-accent-glow hover:border-accent-glow/50 font-mono text-sm tracking-wide transition-all duration-200 overflow-hidden"
              style={{clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)'}}
            >
              <span className="relative z-10">GALLERY</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/10 to-accent-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
            
            {/* 状态指示器 */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-background-secondary/50 border border-neon-cyan/30">
              <div className="w-2 h-2 bg-neon-green animate-pulse" />
              <span className="text-xs font-mono text-primary-300">ONLINE</span>
            </div>
          </div>

          {/* Mobile menu button - Punk风格 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative inline-flex items-center justify-center p-3 bg-background-secondary border border-primary-glow/30 text-primary-glow hover:text-accent-glow hover:border-accent-glow/50 focus:outline-none transition-all duration-200 group overflow-hidden"
              style={{clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)'}}
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-5 w-5 relative z-10" />
              ) : (
                <Bars3Icon className="block h-5 w-5 relative z-10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/10 to-accent-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              {/* 装饰性角标 */}
              <div className="absolute top-0 right-0 w-1 h-1 bg-neon-cyan opacity-60 animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Punk风格 */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-down">
          <div className="relative px-6 pt-4 pb-6 space-y-4 bg-background-card/95 backdrop-blur-md border-t border-primary-glow/30">
            {/* 装饰性扫描线 */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-glow to-transparent opacity-60 animate-scan-line" />
            
            {/* Mobile Search - Punk风格 */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative bg-background-secondary border border-primary-glow/30 transition-all duration-300 group-hover:border-accent-glow/50" style={{clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)'}}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-primary-glow" />
                </div>
                
                {/* 终端风格前缀 */}
                <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                  <span className="text-accent-glow font-mono text-sm">&gt;</span>
                </div>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-16 pr-4 py-3 bg-transparent text-white placeholder-primary-300 focus:outline-none font-mono text-sm tracking-wide"
                  placeholder="SEARCH_QUERY..."
                />
                
                {/* 装饰性角标 */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-neon-cyan opacity-60 animate-pulse" />
              </div>
            </form>
            
            {/* Mobile Navigation - Punk风格 */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={() => {
                  router.push('/collections');
                  setIsMenuOpen(false);
                }}
                className="relative group block w-full text-left px-4 py-3 bg-background-secondary border border-primary-glow/30 text-primary-glow hover:text-accent-glow hover:border-accent-glow/50 font-mono tracking-wide transition-all duration-200 overflow-hidden"
                style={{clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)'}}
              >
                <span className="relative z-10">&gt; COLLECTIONS</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/10 to-accent-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
              <button 
                onClick={() => {
                  router.push('/');
                  setIsMenuOpen(false);
                }}
                className="relative group block w-full text-left px-4 py-3 bg-background-secondary border border-primary-glow/30 text-primary-glow hover:text-accent-glow hover:border-accent-glow/50 font-mono tracking-wide transition-all duration-200 overflow-hidden"
                style={{clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)'}}
              >
                <span className="relative z-10">&gt; GALLERY</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/10 to-accent-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
              
              {/* 移动端状态信息 */}
              <div className="flex items-center justify-between px-4 py-2 bg-background-secondary/50 border border-neon-cyan/30 font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green animate-pulse" />
                  <span className="text-primary-300">SYSTEM_ONLINE</span>
                </div>
                <div className="flex items-center space-x-1 text-accent-glow">
                  <span>[</span>
                  <span>MOBILE</span>
                  <span>]</span>
                </div>
              </div>
            </div>
            
            {/* 底部装饰性数据流 */}
            <div className="absolute -bottom-1 left-0 w-full flex justify-center space-x-2 opacity-40">
              {Array.from({length: 8}).map((_, i) => (
                <div 
                  key={i} 
                  className="w-px bg-gradient-to-t from-primary-glow to-transparent" 
                  style={{
                    height: `${Math.random() * 6 + 2}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}