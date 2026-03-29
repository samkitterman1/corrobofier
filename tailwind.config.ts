import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:            '#0c0c0e',
        surface:       '#131316',
        surface2:      '#1a1a1f',
        text:          '#e8e8ea',
        muted:         '#6b6b75',
        brand:         '#f04a00',
        'brand-light': '#f1642c',
        danger:        '#f56464',
        warning:       '#f5a623',
        success:       '#64f5a0',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
