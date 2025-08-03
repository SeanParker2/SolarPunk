// frontend/src/components/HeroSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, SparklesIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import CyberBackground from './CyberBackground';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onTagClick: (tag: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onTagClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const popularTags = [
    '未来城市', '可持续能源', '绿色科技', '生态建筑', 
    '太阳能', '垂直农场', '清洁交通', '智慧城市'
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-background-dark">
      {/* 动态背景 */}
      <CyberBackground />
      
      {/* 背景视频/图片层 */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url("/hero-bg.jpg")',
            filter: 'brightness(0.4) contrast(1.2) saturate(1.5)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark/80 via-background-dark/60 to-primary-900/40" />
      </div>

      {/* 故障艺术装饰线条 */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60 animate-cyber-flicker" />
        <div className="absolute top-3/4 right-0 w-2/3 h-px bg-gradient-to-l from-transparent via-accent-glow to-transparent opacity-40" />
        <div className="absolute top-1/2 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary-glow to-transparent opacity-50" />
        <div className="absolute bottom-1/3 right-1/3 w-px h-24 bg-gradient-to-t from-transparent via-neon-green to-transparent opacity-60 animate-glow-pulse" />
        <div className="absolute top-1/3 right-1/4 w-16 h-px bg-gradient-to-r from-transparent via-accent-glow to-transparent opacity-30 transform rotate-45" />
        <div className="absolute bottom-1/4 left-1/3 w-12 h-px bg-gradient-to-l from-transparent via-primary-glow to-transparent opacity-40 transform -rotate-12" />
      </div>

      {/* 不对称布局容器 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部区域 - Logo和搜索 */}
        <div className="flex justify-between items-start p-8">
          {/* 左上角 - Logo */}
          <div className={`transition-all duration-1000 delay-300 group ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="relative">
              <h1 className="text-2xl font-cyber font-bold text-primary-glow tracking-wider relative z-10">
                <span className="animate-cyber-flicker">SOLAR</span>
                <span className="text-accent-glow">PUNK</span>
              </h1>
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-glow/10 to-accent-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{clipPath: 'polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)'}} />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-16 h-0.5 bg-gradient-to-r from-primary-glow to-transparent" />
              <div className="w-2 h-2 bg-accent-glow opacity-60 animate-pulse" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} />
              <div className="w-8 h-px bg-gradient-to-r from-accent-glow/50 to-transparent" />
            </div>
          </div>

          {/* 右上角 - 搜索框 - 增强Punk风格 */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <form onSubmit={handleSearch} className="relative group">
              <div className={`flex items-center transition-all duration-300 ${
                isSearchExpanded ? 'w-80' : 'w-12'
              }`}>
                {/* 装饰性边框 */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-primary-glow via-accent-glow to-primary-glow opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-glow-pulse ${
                  isSearchExpanded ? 'block' : 'hidden'
                }`} style={{clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)'}} />
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                  placeholder="> SEARCH_PUNK_WORLD..."
                  className={`bg-background-card/80 backdrop-blur-sm border-2 border-primary-glow/50 text-white placeholder-primary-300 font-mono text-sm transition-all duration-300 ${
                    isSearchExpanded 
                      ? 'px-4 py-2 w-full shadow-glow-primary' 
                      : 'w-0 px-0 py-2 border-transparent'
                  } focus:outline-none focus:border-accent-glow focus:shadow-glow-accent`}
                  style={isSearchExpanded ? {clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)'} : {}}
                />
                
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  className="ml-2 p-2 text-primary-glow hover:text-accent-glow transition-all duration-200 hover:shadow-glow-accent relative group/btn"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/20 to-accent-glow/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" style={{clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)'}} />
                </button>
              </div>
              
              {/* 终端风格装饰 */}
              {isSearchExpanded && (
                <div className="absolute -bottom-6 left-0 flex items-center space-x-2 text-xs font-mono text-primary-300/60">
                  <span className="text-accent-glow">[</span>
                  <span className="animate-terminal-blink">_</span>
                  <span className="text-accent-glow">]</span>
                  <span>READY_FOR_INPUT</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* 中央空白区域 - 让用户欣赏背景 */}
        <div className="flex-1" />

        {/* 左下角 - 主标题和描述 */}
        <div className="absolute bottom-32 left-8 max-w-2xl">
          <div className={`transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative">
              <h2 
                className="text-6xl md:text-8xl font-display font-black text-white mb-6 leading-none tracking-tight relative z-10"
                style={{
                  textShadow: '4px 4px 8px rgba(0,0,0,0.8), 0 0 30px rgba(20, 184, 166, 0.4)'
                }}
              >
                <span className="relative">
                  反叛
                  <div className="absolute -right-4 top-0 w-1 h-full bg-accent-glow opacity-60 animate-cyber-flicker" />
                </span>
                <br />
                <span className="text-primary-glow animate-glow-pulse relative">
                  太阳朋克
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-glow via-accent-glow to-transparent opacity-40" />
                </span>
                <br />
                <span className="relative">
                  未来
                  <div className="absolute -left-2 top-1/2 w-px h-8 bg-neon-green opacity-80 animate-glow-pulse" />
                </span>
              </h2>
              
              {/* 装饰性故障线条 */}
              <div className="absolute -top-4 -left-4 w-32 h-px bg-gradient-to-r from-accent-glow to-transparent opacity-60 animate-cyber-flicker" />
              <div className="absolute -bottom-4 right-8 w-24 h-px bg-gradient-to-l from-primary-glow to-transparent opacity-40" />
            </div>
            
            <div className="relative">
              <p className="text-lg font-mono text-primary-200 mb-8 leading-relaxed max-w-lg relative z-10">
                <span className="text-accent-glow">&gt;</span> <span className="text-neon-green">HACK</span> 传统能源体系_
                <br />
                <span className="text-accent-glow">&gt;</span> <span className="text-neon-cyan">BUILD</span> 生态科技革命_
                <br />
                <span className="text-accent-glow">&gt;</span> <span className="text-primary-glow">RESIST</span> 环境破坏_
                <br />
                <span className="animate-terminal-blink text-accent-glow">█</span>
              </p>
              
              {/* 终端风格装饰框 */}
              <div className="absolute -inset-4 border border-primary-glow/20 opacity-60" style={{clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)'}} />
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-glow opacity-80" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-glow opacity-80" />
            </div>
          </div>
        </div>

        {/* 右下角 - 标签云 */}
        <div className="absolute bottom-16 right-8 max-w-md">
          <div className={`transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-right mb-4 relative">
              <span className="text-accent-glow font-mono text-sm tracking-wider relative z-10">// HACK_TAGS</span>
              <div className="absolute -right-2 top-1/2 w-8 h-px bg-gradient-to-l from-accent-glow to-transparent opacity-60" />
            </div>
            <div className="flex flex-wrap justify-end gap-2 relative">
              {popularTags.map((tag, index) => (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className="relative px-3 py-1 text-xs font-mono text-primary-300 border border-primary-glow/30 hover:border-accent-glow hover:text-accent-glow hover:shadow-glow-accent transition-all duration-200 bg-background-dark/50 backdrop-blur-sm group overflow-hidden"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)'
                  }}
                >
                  <span className="relative z-10">{tag}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-glow/20 to-primary-glow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-glow to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
                </button>
              ))}
              
              {/* 装饰性网格线 */}
              <div className="absolute -top-2 -right-2 w-16 h-16 opacity-20 pointer-events-none">
                <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-px">
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className="bg-primary-glow opacity-30" style={{animationDelay: `${i * 0.05}s`}} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部区域 - 增强Punk风格 */}
        <div className="absolute bottom-8 left-0 right-0 px-8">
          <div className="flex justify-between items-end relative">
            {/* 装饰性扫描线 */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-glow to-transparent opacity-40 animate-cyber-flicker" />
            
            {/* 左下角 - 滚动提示 */}
            <div className={`transition-all duration-1000 delay-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex items-center space-x-3 text-primary-300 group">
                <div className="relative">
                  <div className="w-6 h-10 border-2 border-primary-glow rounded-full flex justify-center group-hover:border-accent-glow transition-colors duration-200 relative overflow-hidden">
                    <div className="w-1 h-3 bg-primary-glow rounded-full mt-2 animate-bounce group-hover:bg-accent-glow transition-colors duration-200" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-glow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  {/* 装饰性光环 */}
                  <div className="absolute -inset-2 border border-primary-glow/20 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-200 animate-pulse" />
                </div>
                <div className="relative">
                  <span className="text-sm font-mono tracking-wider group-hover:text-accent-glow transition-colors duration-200">SCROLL_TO_EXPLORE</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-accent-glow to-transparent group-hover:w-full transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* 中心 - 核心交互元素 */}
            <div className={`transition-all duration-1000 delay-1100 absolute left-1/2 transform -translate-x-1/2 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <button className="relative group" onClick={() => {/* 添加核心交互逻辑 */}}>
                {/* 主核心 */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-glow via-accent-glow to-neon-cyan rounded-full flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-glow via-accent-glow to-neon-cyan animate-glow-pulse" />
                  <div className="absolute inset-2 bg-background-primary rounded-full" />
                  <div className="relative z-10 w-8 h-8 bg-gradient-to-br from-primary-glow to-accent-glow rounded-full animate-pulse" />
                </div>
                
                {/* 环绕装饰 */}
                <div className="absolute -inset-4 border border-primary-glow/30 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute -inset-6 border border-accent-glow/20 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-200 animate-spin" style={{animationDuration: '8s'}} />
                
                {/* 能量脉冲 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-glow/20 to-accent-glow/20 opacity-0 group-hover:opacity-100 animate-ping" />
                
                {/* 数据流线条 */}
                <div className="absolute top-1/2 -left-8 w-6 h-px bg-gradient-to-r from-transparent to-primary-glow opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute top-1/2 -right-8 w-6 h-px bg-gradient-to-l from-transparent to-accent-glow opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute -top-8 left-1/2 w-px h-6 bg-gradient-to-b from-transparent to-neon-green opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute -bottom-8 left-1/2 w-px h-6 bg-gradient-to-t from-transparent to-neon-cyan opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
              
              {/* 核心标签 */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-mono text-primary-300/60 whitespace-nowrap">
                <span className="text-accent-glow">[</span>CORE_ACCESS<span className="text-accent-glow">]</span>
              </div>
            </div>

            {/* 右下角 - 状态信息 */}
            <div className={`transition-all duration-1000 delay-1200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="text-right relative">
                {/* 状态面板背景 */}
                <div className="absolute -inset-3 bg-gradient-to-br from-background-card/40 to-background-secondary/40 backdrop-blur-sm border border-primary-glow/20" style={{clipPath: 'polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)'}} />
                
                <div className="relative z-10 p-3">
                  <div className="text-xs font-mono text-primary-300/60 mb-1 flex items-center justify-end space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                    <span>// STATUS: <span className="text-neon-green">ONLINE</span></span>
                  </div>
                  <div className="text-xs font-mono text-accent-glow mb-1">
                    IMAGES_LOADED: <span className="text-white">{Math.floor(Math.random() * 1000) + 500}</span>
                  </div>
                  <div className="text-xs font-mono text-primary-glow">
                    PUNK_LEVEL: <span className="text-neon-cyan">MAX</span>
                  </div>
                  
                  {/* 装饰性数据条 */}
                  <div className="mt-2 flex justify-end space-x-1">
                    {Array.from({length: 8}).map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1 bg-gradient-to-t from-primary-glow to-accent-glow opacity-60" 
                        style={{
                          height: `${Math.random() * 12 + 4}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;