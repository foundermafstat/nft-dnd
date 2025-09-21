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
        background: {
          DEFAULT: '#0a0a0a',
          dark: '#050505',
          light: '#121212'
        },
        foreground: {
          DEFAULT: '#ffffff',
          muted: '#a0a0a0'
        },
        neon: {
          green: '#c1ff00',
          blue: '#00f0ff'
        },
        card: {
          DEFAULT: '#151515',
          dark: '#101010',
          light: '#1a1a1a'
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(193, 255, 0, 0.5)',
        'neon-strong': '0 0 20px rgba(193, 255, 0, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-card': 'linear-gradient(to bottom right, #151515, #0a0a0a)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

