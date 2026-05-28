/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        geovista: {
          cyan: '#22d3ee',
          teal: '#14b8a6',
          violet: '#8b5cf6',
        },
        surface: {
          DEFAULT: '#0d1117',
          1: '#161b22',
          2: '#1c2128',
          3: '#22272e',
          4: '#2d333b',
        },
        border: {
          DEFAULT: '#30363d',
          light: '#484f58',
        },
        accent: {
          cyan: '#22d3ee',
          green: '#4ade80',
          amber: '#fbbf24',
        },
      },
    },
  },
  plugins: [],
};
