/** @type {import('tailwindcss').Config} */
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
        // ── PRIMARY ──────────────────────────────────────────────────
        'primary':                    '#004e99',
        'primary-container':          '#0a66c2',
        'on-primary':                 '#ffffff',
        'on-primary-container':       '#dbe6ff',
        'primary-fixed':              '#d6e3ff',
        'primary-fixed-dim':          '#a8c8ff',
        'on-primary-fixed':           '#001b3d',
        'on-primary-fixed-variant':   '#00468a',
        'inverse-primary':            '#a8c8ff',

        // Primary shade scale (kept for existing components using primary-600 etc.)
        'primary-50':  '#eef5fc',
        'primary-100': '#d6e3ff',
        'primary-200': '#a8c8ff',
        'primary-300': '#7aa7f0',
        'primary-400': '#4285d4',
        'primary-500': '#1a6fc4',
        'primary-600': '#0a66c2',
        'primary-700': '#004e99',
        'primary-800': '#00468a',
        'primary-900': '#003366',
        'primary-950': '#001b3d',

        // ── SECONDARY ────────────────────────────────────────────────
        'secondary':                    '#565e74',
        'secondary-container':          '#dae2fd',
        'on-secondary':                 '#ffffff',
        'on-secondary-container':       '#5c647a',
        'secondary-fixed':              '#dae2fd',
        'secondary-fixed-dim':          '#bec6e0',
        'on-secondary-fixed':           '#131b2e',
        'on-secondary-fixed-variant':   '#3f465c',

        // ── TERTIARY ─────────────────────────────────────────────────
        'tertiary':                     '#355076',
        'tertiary-container':           '#4e6890',
        'on-tertiary':                  '#ffffff',
        'on-tertiary-container':        '#dbe7ff',
        'tertiary-fixed':               '#d5e3ff',
        'tertiary-fixed-dim':           '#adc8f5',
        'on-tertiary-fixed':            '#001c3b',
        'on-tertiary-fixed-variant':    '#2d486d',

        // ── SURFACE ──────────────────────────────────────────────────
        'surface':                      '#f8f9fb',
        'surface-white':                '#FFFFFF',
        'surface-bright':               '#f8f9fb',
        'surface-dim':                  '#d9dadc',
        'surface-variant':              '#e1e2e4',
        'surface-tint':                 '#005eb5',
        'surface-container':            '#edeef0',
        'surface-container-lowest':     '#ffffff',
        'surface-container-low':        '#f2f4f6',
        'surface-container-high':       '#e7e8ea',
        'surface-container-highest':    '#e1e2e4',
        'on-surface':                   '#191c1e',
        'on-surface-variant':           '#414752',
        'inverse-surface':              '#2e3132',
        'inverse-on-surface':           '#f0f1f3',

        // ── TEXT SEMANTIC ────────────────────────────────────────────
        'text-primary': '#0F172A',
        'text-muted':   '#64748B',

        // ── OUTLINE ──────────────────────────────────────────────────
        'outline':         '#727783',
        'outline-variant': '#c1c6d4',

        // ── BACKGROUND ───────────────────────────────────────────────
        'background':    '#f8f9fb',
        'on-background': '#191c1e',

        // ── ACCENT (creative indigo — freelancer-platform signature) ──
        'accent':        '#6366F1',
        'accent-light':  '#818CF8',
        'accent-dark':   '#4f46e5',
        'accent-soft':   '#EEF2FF',

        // ── STATUS ───────────────────────────────────────────────────
        'success':           '#16A34A',
        'error':             '#ba1a1a',
        'error-container':   '#ffdad6',
        'on-error':          '#ffffff',
        'on-error-container':'#93000a',

        // Success shade scale
        'success-50':  '#ecfdf3',
        'success-100': '#d1fadf',
        'success-200': '#a6f4c5',
        'success-400': '#32d583',
        'success-500': '#16a34a',
        'success-600': '#16a34a',
        'success-700': '#15803d',
        'success-900': '#05603a',

        // ── LEGACY / COMPAT ALIASES ───────────────────────────────────
        'logo-red':      '#CE1126',
        'brand-blue':    '#0a66c2',
        'brand-mid':     '#004e99',
        'brand-dark':    '#0F172A',
        'surface-grey':  '#f8f9fb',
        'border-default':'#c1c6d4',
        'text-secondary':'#565e74',
        'green-success': '#16a34a',
        'cta':           '#1E3A5F',
        'navy':          '#0F172A',
        'chip':          '#edeef0',
        'chip-blue':     '#dae2fd',
        'ink':           '#0F172A',
        'ivory':         '#f8f9fb',
        'muted':         '#64748B',
        'line':          '#c1c6d4',

        // ── DARK MODE ────────────────────────────────────────────────
        night: {
          bg:     '#0a0f1a',
          card:   '#121a2a',
          border: '#27344a',
        },
      },

      spacing: {
        'margin-desktop': '40px',
        'margin-mobile':  '16px',
        'stack-sm':       '8px',
        'stack-md':       '16px',
        'stack-lg':       '32px',
        'section-gap':    '80px',
        'gutter':         '24px',
        'container-max':  '1280px',
      },

      maxWidth: {
        content:       '1280px',
        'container-max': '1280px',
      },

      fontFamily: {
        sans:               ['var(--font-sans)', 'IBM Plex Sans', 'sans-serif'],
        arabic:             ['var(--font-arabic)', 'IBM Plex Sans Arabic', 'sans-serif'],
        'headline-xl':      ['var(--font-sans)', 'IBM Plex Sans', 'sans-serif'],
        'headline-lg':      ['var(--font-sans)', 'IBM Plex Sans', 'sans-serif'],
        'headline-lg-mobile':['var(--font-sans)', 'IBM Plex Sans', 'sans-serif'],
        'headline-md':      ['var(--font-sans)', 'IBM Plex Sans', 'sans-serif'],
        'body-lg':          ['var(--font-sans)', 'IBM Plex Sans', 'sans-serif'],
        'body-md':          ['var(--font-sans)', 'IBM Plex Sans', 'sans-serif'],
        'body-sm':          ['var(--font-sans)', 'IBM Plex Sans', 'sans-serif'],
        'label-md':         ['var(--font-sans)', 'IBM Plex Sans', 'sans-serif'],
      },

      fontSize: {
        display: ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        h1:      ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        h2:      ['2rem',   { lineHeight: '1.2', fontWeight: '600' }],
        h3:      ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
      },

      boxShadow: {
        card:      '0 1px 4px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 6px 16px rgba(0, 0, 0, 0.10)',
      },

      borderRadius: {
        card: '12px',
      },

      transitionDuration: {
        DEFAULT: '150ms',
      },

      backgroundImage: {
        'brand-gradient': 'linear-gradient(120deg, #004e99 0%, #0a66c2 45%, #6366F1 100%)',
        'brand-gradient-soft': 'linear-gradient(120deg, #0a66c2 0%, #6366F1 100%)',
      },

      animation: {
        'fade-in':      'fadeIn 0.2s ease-in-out',
        'slide-up':     'slideUp 0.3s ease-out',
        'slide-in-end': 'slideInEnd 0.25s ease-out',
        float:          'float 6s ease-in-out infinite',
        'glow-pulse':   'glowPulse 5s ease-in-out infinite',
      },

      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':       { opacity: '0.8', transform: 'scale(1.08)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        slideInEnd: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--tw-rotate))' },
          '50%':       { transform: 'translateY(-20px) rotate(var(--tw-rotate))' },
        },
      },
    },
  },
  plugins: [],
};
