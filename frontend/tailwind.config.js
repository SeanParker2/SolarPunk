/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Punk 风格深色配色方案
        background: {
          primary: '#0a0f0d',    // 深邃午夜绿 - 主背景
          secondary: '#111b17',  // 深灰绿 - 次级背景
          card: '#1a2b23',       // 深色卡片背景
          overlay: '#000000cc',  // 半透明遮罩
        },
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',        // 深松石绿 - 主色调
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          glow: '#14b8a6',       // 辉光色
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',        // 琥珀色 - 亮色调
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          glow: '#fbbf24',       // 辉光色
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',        // 森林绿 - 备选主色
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          glow: '#22c55e',       // 辉光色
        },
        neon: {
          cyan: '#00ffff',
          green: '#00ff41',
          pink: '#ff0080',
          purple: '#8000ff',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Kosugi Maru', 'YuGothic', 'Yu Gothic Medium', 'Meiryo', 'sans-serif'],
        display: ['system-ui', 'sans-serif'], // 科技感展示字体
        mono: ['Courier New', 'monospace'], // 等宽字体
        cyber: ['Courier New', 'monospace'], // 赛博朋克字体
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
        'clip': '0.5rem 0.5rem 0 0.5rem', // 斜切角效果
      },
      boxShadow: {
          'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
          'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
          'glow-primary': '0 0 20px rgba(20, 184, 166, 0.6), 0 0 40px rgba(20, 184, 166, 0.3)',
          'glow-accent': '0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)',
          'glow-neon': '0 0 30px currentColor, 0 0 60px currentColor',
          'inner-glow': 'inset 0 0 20px rgba(20, 184, 166, 0.3)',
          'cyber': '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3), 0 0 30px rgba(0, 255, 255, 0.1)',
        },
      animation: {
          'fade-in': 'fade-in 0.5s ease-out',
          'slide-up': 'slide-up 0.6s ease-out',
          'slide-down': 'slide-down 0.6s ease-out',
          'scale-in': 'scale-in 0.3s ease-out',
          'modal-in': 'modal-in 0.3s ease-out',
          'float': 'float 6s ease-in-out infinite',
          'shimmer': 'shimmer 2s linear infinite',
          'scroll-fade-in': 'scroll-fade-in 0.6s ease-out forwards',
          'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
          'glitch': 'glitch 0.3s ease-in-out',
          'scan-line': 'scan-line 2s linear infinite',
          'terminal-blink': 'terminal-blink 1s step-end infinite',
          'particle-float': 'particle-float 8s ease-in-out infinite',
          'cyber-flicker': 'cyber-flicker 0.1s ease-in-out infinite alternate',
        },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'modal-in': {
          '0%': { transform: 'scale(0.9) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'scroll-fade-in': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'shimmer': {
           '0%': { transform: 'translateX(-100%)' },
           '100%': { transform: 'translateX(100%)' },
         },
         'glow-pulse': {
           '0%, 100%': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.4)' },
           '50%': { boxShadow: '0 0 40px rgba(20, 184, 166, 0.8), 0 0 60px rgba(20, 184, 166, 0.4)' },
         },
         'glitch': {
           '0%': { transform: 'translate(0)' },
           '20%': { transform: 'translate(-2px, 2px)' },
           '40%': { transform: 'translate(-2px, -2px)' },
           '60%': { transform: 'translate(2px, 2px)' },
           '80%': { transform: 'translate(2px, -2px)' },
           '100%': { transform: 'translate(0)' },
         },
         'scan-line': {
           '0%': { transform: 'translateY(-100%)' },
           '100%': { transform: 'translateY(100vh)' },
         },
         'terminal-blink': {
           '0%, 50%': { opacity: '1' },
           '51%, 100%': { opacity: '0' },
         },
         'particle-float': {
           '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
           '25%': { transform: 'translateY(-20px) translateX(10px)' },
           '50%': { transform: 'translateY(-10px) translateX(-5px)' },
           '75%': { transform: 'translateY(-30px) translateX(15px)' },
         },
         'cyber-flicker': {
           '0%': { opacity: '1' },
           '100%': { opacity: '0.8' },
         },
        },
    },
  },
  plugins: [],
}

