'use client';

import { HeartIcon, GlobeAltIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: '关于',
      links: [
        { name: '关于我们', href: '#' },
        { name: '使命愿景', href: '#' },
        { name: '团队介绍', href: '#' },
      ]
    },
    {
      title: '法律',
      links: [
        { name: '许可协议', href: '#' },
        { name: '隐私政策', href: '#' },
        { name: '使用条款', href: '#' },
      ]
    },
    {
      title: '社区',
      links: [
        { name: 'GitHub', href: 'https://github.com' },
        { name: '反馈建议', href: '#' },
        { name: '联系我们', href: '#' },
      ]
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-background-primary via-background-secondary to-background-card border-t border-primary-glow/30 overflow-hidden">
      {/* 装饰性背景线条 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-glow to-transparent opacity-60" />
        <div className="absolute top-1/3 right-0 w-2/3 h-px bg-gradient-to-l from-transparent via-accent-glow to-transparent opacity-40 animate-cyber-flicker" />
        <div className="absolute bottom-1/3 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-neon-green to-transparent opacity-50" />
        <div className="absolute top-1/2 right-1/3 w-px h-24 bg-gradient-to-t from-transparent via-neon-cyan to-transparent opacity-60 animate-glow-pulse" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section - 增强Punk风格 */}
          <div className="lg:col-span-1 relative">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-accent-glow to-primary-glow flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-accent-glow to-primary-glow opacity-0 group-hover:opacity-100 animate-glow-pulse" />
                <GlobeAltIcon className="h-6 w-6 text-white relative z-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-cyber tracking-wider group-hover:text-primary-glow transition-colors duration-300">
                  <span className="animate-cyber-flicker">SOLAR</span>
                  <span className="text-accent-glow">PUNK</span>
                </h3>
                <p className="text-xs text-primary-300 font-mono tracking-wider">// 反叛绿色革命</p>
              </div>
            </div>
            
            <div className="relative">
              <p className="text-sm text-primary-200 leading-relaxed mb-6 font-mono">
                <span className="text-accent-glow">&gt;</span> <span className="text-neon-green">HACK</span> 传统能源体系<br/>
                <span className="text-accent-glow">&gt;</span> <span className="text-neon-cyan">BUILD</span> 生态科技未来<br/>
                <span className="text-accent-glow">&gt;</span> <span className="text-primary-glow">RESIST</span> 环境破坏
              </p>
              
              {/* 装饰性边框 */}
              <div className="absolute -inset-2 border border-primary-glow/20 opacity-60" style={{clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)'}} />
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-primary-300 relative">
              <div className="w-2 h-2 bg-neon-green animate-pulse" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} />
              <span className="font-mono tracking-wider">BUILDING_GREEN_RESISTANCE</span>
              <div className="w-4 h-px bg-gradient-to-r from-accent-glow to-transparent opacity-60" />
            </div>
          </div>

          {/* Links Sections - Punk风格 */}
          {footerLinks.map((section, sectionIndex) => (
            <div key={section.title} className="relative">
              <div className="relative mb-4">
                <h4 className="text-sm font-semibold text-white mb-2 font-cyber tracking-wider">
                  <span className="text-accent-glow">//</span> {section.title.toUpperCase()}
                </h4>
                <div className="w-8 h-px bg-gradient-to-r from-primary-glow to-transparent opacity-60" />
                
                {/* 装饰性角标 */}
                <div className="absolute -top-1 -left-2 w-1 h-6 bg-gradient-to-b from-accent-glow to-transparent opacity-40" />
              </div>
              
              <ul className="space-y-3 relative">
                {section.links.map((link, linkIndex) => (
                  <li key={link.name} className="relative group">
                    <a
                      href={link.href}
                      className="text-sm text-primary-200 hover:text-accent-glow transition-all duration-200 font-mono tracking-wide relative z-10 flex items-center space-x-2"
                    >
                      <span className="text-primary-glow opacity-60 group-hover:opacity-100 transition-opacity duration-200">&gt;</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                    </a>
                    
                    {/* 悬停效果线条 */}
                    <div className="absolute left-0 bottom-0 w-0 h-px bg-gradient-to-r from-accent-glow to-primary-glow group-hover:w-full transition-all duration-300" />
                    
                    {/* 装饰性像素点 */}
                    <div 
                      className="absolute -left-4 top-1/2 w-1 h-1 bg-neon-green opacity-0 group-hover:opacity-60 transition-opacity duration-200" 
                      style={{animationDelay: `${linkIndex * 0.1}s`}}
                    />
                  </li>
                ))}
              </ul>
              
              {/* 区域装饰线 */}
              {sectionIndex < footerLinks.length - 1 && (
                <div className="absolute -right-6 top-1/2 w-px h-16 bg-gradient-to-b from-transparent via-primary-glow/30 to-transparent opacity-60" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section - 增强Punk风格 */}
        <div className="pt-8 border-t border-primary-glow/30 relative">
          {/* 装饰性扫描线 */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-glow to-transparent opacity-60 animate-cyber-flicker" />
          
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 relative">
            <div className="flex items-center space-x-6 text-sm text-primary-200 font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-accent-glow">©</span>
                <span>{currentYear}</span>
                <span className="text-primary-glow font-cyber tracking-wider">
                  <span className="animate-cyber-flicker">SOLAR</span>
                  <span className="text-accent-glow">PUNK</span>
                </span>
                <span className="text-primary-glow">HUB</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-1 h-1 bg-accent-glow" />
                <div className="w-2 h-px bg-gradient-to-r from-accent-glow to-transparent" />
              </div>
              
              <div className="flex items-center space-x-2 group">
                <div className="relative">
                  <CodeBracketIcon className="h-4 w-4 text-primary-glow group-hover:text-accent-glow transition-colors duration-200" />
                  <div className="absolute -inset-1 bg-primary-glow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)'}} />
                </div>
                <span className="group-hover:text-accent-glow transition-colors duration-200">OPEN_SOURCE</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* 系统状态 */}
              <div className="flex items-center space-x-2 text-xs text-primary-200 font-mono">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-neon-green animate-pulse" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} />
                  <div className="w-2 h-2 bg-accent-glow animate-pulse" style={{animationDelay: '0.5s'}} />
                  <div className="w-2 h-2 bg-primary-glow animate-pulse" style={{animationDelay: '1s'}} />
                </div>
                <span className="text-neon-green">SYSTEM_ONLINE</span>
              </div>
              
              {/* 版本信息 */}
              <div className="flex items-center space-x-2 text-xs text-primary-300 font-mono">
                <span className="text-accent-glow">[</span>
                <span>v2.0.1</span>
                <span className="text-accent-glow">]</span>
                <div className="w-4 h-px bg-gradient-to-r from-accent-glow to-transparent opacity-60" />
              </div>
              
              {/* 核心能量指示器 */}
              <div className="relative group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-glow via-accent-glow to-neon-cyan rounded-full flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-glow via-accent-glow to-neon-cyan animate-glow-pulse" />
                  <div className="absolute inset-1 bg-background-primary rounded-full" />
                  <div className="relative z-10 w-3 h-3 bg-gradient-to-br from-primary-glow to-accent-glow rounded-full animate-pulse" />
                </div>
                
                {/* 能量环 */}
                <div className="absolute -inset-2 border border-primary-glow/30 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200 animate-spin" style={{animationDuration: '4s'}} />
                
                {/* 状态标签 */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-primary-300/60 whitespace-nowrap">
                  <span className="text-accent-glow">[</span>CORE<span className="text-accent-glow">]</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 底部装饰性数据流 */}
          <div className="absolute -bottom-2 left-0 w-full flex justify-center space-x-2 opacity-40">
            {Array.from({length: 12}).map((_, i) => (
              <div 
                key={i} 
                className="w-px bg-gradient-to-t from-primary-glow to-transparent" 
                style={{
                  height: `${Math.random() * 8 + 2}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;