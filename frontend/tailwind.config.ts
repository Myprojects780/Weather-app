import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
      },
      boxShadow: {
        glass: '0 24px 80px rgba(0, 0, 0, 0.45)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at top, rgba(245, 158, 11, 0.22), transparent 35%), radial-gradient(circle at bottom right, rgba(234, 88, 12, 0.18), transparent 28%)',
      },
    },
  },
  plugins: [],
}

export default config
