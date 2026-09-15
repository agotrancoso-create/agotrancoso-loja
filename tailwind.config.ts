import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        marrom: '#4B2B1E',
        marrom2: '#4B2C1F',
        terracota: '#8A3F1F',
        terracota2: '#A4511F',
        areia: '#F5F0EA',
        areia2: '#E8DDD3',
        oliva: '#817963',
        oliva2: '#6B5434',
        texto: '#2E211B',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Lato', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
      borderRadius: { image: '20px' },
      boxShadow: { soft: '0 10px 30px rgba(75,43,30,.08)' },
    },
  },
  plugins: [],
};

export default config;
