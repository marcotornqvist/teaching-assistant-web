import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      main: ['var(--font-inter)'],
    },
    colors: {
      grey: '#5C5C5C',
      'dark-grey': '#333333',
      'light-grey': '#AAAAAA',
      black: '#212121',
      green: '#69F695',
      red: '#FF5757',
      blue: '#57A0FF',
      white: '#FFFFFF',
    },
    extend: {
      borderRadius: {},
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addComponents }) {
      addComponents({
        '.text-xl-bold': {
          fontSize: '1.25rem',
          fontWeight: '700',
          lineHeight: '150%',
        },

        '.text-lg-bold': {
          fontSize: '1.125rem',
          fontWeight: '700',
          lineHeight: '150%',
        },

        '.text-lg-medium': {
          fontSize: '1.125rem',
          fontWeight: '500',
          lineHeight: '150%',
        },

        '.text-base-medium': {
          fontSize: '1rem',
          fontWeight: '500',
          lineHeight: '150%',
        },

        '.text-sm-medium': {
          fontSize: '0.875rem',
          fontWeight: '500',
          lineHeight: '150%',
        },
      });
    }),
  ],
} satisfies Config;
