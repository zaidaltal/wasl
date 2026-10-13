/** @type {import('tailwindcss').Config} */

// Colors resolve to CSS variables (RGB triplets) defined in globals.css,
// so light/dark themes swap in one place and opacity modifiers keep working.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        sunken: token('sunken'),
        ink: token('ink'),
        'ink-soft': token('ink-soft'),
        muted: token('muted'),
        line: token('line'),
        accent: {
          DEFAULT: token('accent'),
          strong: token('accent-strong'),
          soft: token('accent-soft'),
          on: token('on-accent'),
        },
        success: {
          DEFAULT: token('success'),
          soft: token('success-soft'),
        },
        warn: {
          DEFAULT: token('warn'),
          soft: token('warn-soft'),
        },
        danger: {
          DEFAULT: token('danger'),
          soft: token('danger-soft'),
        },
        // Fixed deep tone for photo scrims and the footer, identical in both themes
        night: '#0C0E13',
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'var(--font-arabic)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-arabic)', 'system-ui', 'sans-serif'],
        callig: ['var(--font-callig)', 'var(--font-arabic)', 'serif'],
      },

      maxWidth: {
        page: '1320px',
      },

      borderRadius: {
        // Shape system: interactive = full pill, containers = shell/core pair, fields = xl
        shell: '1.75rem',
        core: '1.375rem',
      },

      boxShadow: {
        soft: '0 1px 2px rgb(var(--shadow) / 0.04), 0 12px 32px -12px rgb(var(--shadow) / 0.14)',
        lift: '0 2px 4px rgb(var(--shadow) / 0.04), 0 28px 60px -20px rgb(var(--shadow) / 0.22)',
        'inner-hi': 'inset 0 1px 0 rgb(255 255 255 / 0.55)',
        'inner-hi-dark': 'inset 0 1px 0 rgb(255 255 255 / 0.06)',
      },

      transitionTimingFunction: {
        fluid: 'cubic-bezier(0.32, 0.72, 0, 1)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'sheet-in': {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'sheet-in': 'sheet-in 0.5s cubic-bezier(0.32, 0.72, 0, 1) both',
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
