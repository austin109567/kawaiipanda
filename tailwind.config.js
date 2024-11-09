/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      spacing: {
        'safe-area-bottom': 'env(safe-area-inset-bottom, 1rem)',
      },
      fontFamily: {
        title: ['Archivo Black', 'sans-serif'],     // For main titles and large headlines
        heading: ['Rubik', 'sans-serif'],           // For section headings and medium headlines
        body: ['Arial', 'sans-serif'],              // For body text and paragraphs
      },
      colors: {
        primary: {
          main: '#E8825F',
          secondary: '#63b0ad',
          tertiary: '#ADC8E2',
        },
        accent: {
          coral: '#D76A4C',
          teal: '#567A82',
          blue: '#6A94BE'
        },
        background: {
          light: '#F3E5C5',
          sand: '#E2CD9F',
          lavender: '#E6E5F8',
          dark: '#2B3C5A',        // Updated for better contrast
          darker: '#1E2A40'       // Updated for better contrast
        },
        text: {
          light: {
            primary: '#2B3C5A',
            secondary: '#3E3534',
            muted: '#567A82'
          },
          dark: {
            primary: '#F3E5C5',   // Updated for better contrast
            secondary: '#E2CD9F',  // Updated for better contrast
            muted: '#ADC8E2'      // Updated for better contrast
          }
        }
      },
      boxShadow: {
        glow: '0 0 15px rgba(232, 130, 95, 0.2)',
        'glow-strong': '0 0 30px rgba(232, 130, 95, 0.3)',
        'glow-light': '0 0 20px rgba(243, 229, 197, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'in': 'in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(232, 130, 95, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(232, 130, 95, 0.4)' },
        },
        'in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-10%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};