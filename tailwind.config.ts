import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(234, 82%, 57%)',
        accent: 'hsl(158, 75%, 50%)',
        bg: 'hsl(0, 0%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '32px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(0, 0%, 0%, 0.08)',
        modal: '0 16px 48px hsla(0, 0%, 0%, 0.16)',
      },
      fontSize: {
        display: ['3.75rem', { fontWeight: '800' }],
        heading: ['1.5rem', { fontWeight: '700' }],
        body: ['1rem', { fontWeight: '400', lineHeight: '1.75rem' }],
      },
      transitionDuration: {
        fast: '100ms',
        base: '200ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
