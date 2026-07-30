import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Cairo', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'Cairo', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        'background-elevated': 'hsl(var(--background-elevated))',
        foreground: 'hsl(var(--foreground))',
        'foreground-muted': 'hsl(var(--foreground-muted))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          deep: 'hsl(var(--primary-deep))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          deep: 'hsl(var(--secondary-deep))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          deep: 'hsl(var(--destructive-deep))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // ── Ink ramp: layered near-black surfaces ──
        ink: {
          950: '#07090f',
          925: '#0a0d16',
          900: '#0d111c',
          850: '#10141f',
          800: '#141a28',
          700: '#1b2233',
        },
        // ── Neon ramp: signature accents ──
        neon: {
          cyan: '#14b8c4',
          'cyan-bright': '#2ad6e0',
          'cyan-deep': '#0e7a86',
          amber: '#f59e0b',
          'amber-bright': '#fbbf24',
          'amber-deep': '#b45309',
          crimson: '#dc263a',
          'crimson-bright': '#f43f5e',
          'crimson-deep': '#9f1239',
        },
        cream: {
          DEFAULT: '#f2efe6',
          muted: '#9fb4c4',
          dim: '#76849a',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 18px rgba(20, 184, 196, 0.45), 0 0 48px rgba(20, 184, 196, 0.12)',
        'glow-amber': '0 0 18px rgba(245, 158, 11, 0.45), 0 0 48px rgba(245, 158, 11, 0.12)',
        'glow-crimson': '0 0 18px rgba(220, 38, 58, 0.45), 0 0 48px rgba(220, 38, 58, 0.12)',
        'card': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03), 0 8px 24px -12px rgba(0, 0, 0, 0.6)',
        'card-hover': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(20, 184, 196, 0.18), 0 18px 40px -18px rgba(20, 184, 196, 0.35)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
