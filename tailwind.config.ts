import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        '.text-mobile-h1': {
          fontSize: '2.5rem',
          fontWeight: '700',
          lineHeight: '120%',
          fontFamily: 'var(--font-title)',
        },

        '.text-mobile-h2': {
          fontSize: '2.25rem',
          fontWeight: '700',
          lineHeight: '120%',
          fontFamily: 'var(--font-title)',
        },

        '.text-mobile-h3': {
          fontSize: '2rem',
          fontWeight: '700',
          lineHeight: '120%',
          fontFamily: 'var(--font-title)',
        },

        '.text-mobile-h4': {
          fontSize: '1.75rem',
          fontWeight: '700',
          lineHeight: '140%',
          fontFamily: 'var(--font-title)',
        },

        '.text-mobile-h5': {
          fontSize: '1.5rem',
          fontWeight: '700',
          lineHeight: '140%',
          fontFamily: 'var(--font-title)',
        },

        '.text-desktop-h1': {
          fontSize: '3.5rem',
          fontWeight: '700',
          lineHeight: '120%',
          fontFamily: 'var(--font-title)',
        },

        '.text-desktop-h2': {
          fontSize: '3rem',
          fontWeight: '700',
          lineHeight: '120%',
          fontFamily: 'var(--font-title)',
        },

        '.text-desktop-h3': {
          fontSize: '2.5rem',
          fontWeight: '700',
          lineHeight: '120%',
          fontFamily: 'var(--font-title)',
        },

        '.text-desktop-h4': {
          fontSize: '2rem',
          fontWeight: '700',
          lineHeight: '130%',
          fontFamily: 'var(--font-title)',
        },

        '.text-desktop-h5': {
          fontSize: '1.75rem',
          fontWeight: '700',
          lineHeight: '140%',
          fontFamily: 'var(--font-title)',
        },

        '.text-tiny-normal': {
          fontSize: '0.75rem',
          fontWeight: '400',
          lineHeight: '150%',
        },

        '.text-small-normal': {
          fontSize: '0.875rem',
          fontWeight: '400',
          lineHeight: '150%',
        },

        '.text-regular-normal': {
          fontSize: '1rem',
          fontWeight: '400',
          lineHeight: '150%',
        },

        '.text-normal-normal': {
          fontSize: '1rem',
          fontWeight: '400',
          lineHeight: '150%',
        },

        '.text-normal-medium': {
          fontSize: '1rem',
          fontWeight: '500',
          lineHeight: '150%',
        },

        '.text-medium-normal': {
          fontSize: '1.125rem',
          fontWeight: '400',
          lineHeight: '150%',
        },

        '.text-medium-semibold': {
          fontSize: '1.125rem',
          fontWeight: '600',
          lineHeight: '150%',
        },

        '.text-medium-bold': {
          fontSize: '1.125rem',
          fontWeight: '700',
          lineHeight: '150%',
        },
      });
    }),
  ],
} satisfies Config;
