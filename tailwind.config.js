/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Brand Colors — Pixar-level palette
        bubblegum: {
          DEFAULT: '#FF6B9D',
          light: '#FFB3CC',
          dark: '#e6527f',
          50: '#fff0f5',
          100: '#ffe0ec',
          200: '#ffb3cc',
          300: '#ff80aa',
          400: '#ff4d88',
          500: '#FF6B9D',
          600: '#e6527f',
          700: '#cc3a61',
        },
        skyblue: {
          DEFAULT: '#4FC3F7',
          light: '#B3E5FC',
          dark: '#0288D1',
          50: '#e1f5fe',
          100: '#B3E5FC',
          200: '#81D4FA',
          300: '#4FC3F7',
          400: '#29B6F6',
          500: '#03A9F4',
          600: '#0288D1',
        },
        sunshine: {
          DEFAULT: '#FFD93D',
          light: '#FFF176',
          dark: '#F9A825',
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF176',
          400: '#FFEE58',
          500: '#FFD93D',
          600: '#F9A825',
        },
        mintgreen: {
          DEFAULT: '#6BCB77',
          light: '#A8E6CF',
          dark: '#388E3C',
          50: '#F1F8E9',
          100: '#DCEDC8',
          200: '#C5E1A5',
          300: '#AED581',
          400: '#9CCC65',
          500: '#6BCB77',
          600: '#388E3C',
        },
        lavender: {
          DEFAULT: '#C77DFF',
          light: '#E1BEE7',
          dark: '#7B1FA2',
          50: '#F3E5F5',
          100: '#E1BEE7',
          200: '#CE93D8',
          300: '#BA68C8',
          400: '#AB47BC',
          500: '#C77DFF',
          600: '#7B1FA2',
        },
        coral: {
          DEFAULT: '#FF8B64',
          light: '#FFCCBC',
          dark: '#E64A19',
          50: '#FBE9E7',
          100: '#FFCCBC',
          200: '#FFAB91',
          300: '#FF8A65',
          400: '#FF7043',
          500: '#FF8B64',
          600: '#E64A19',
        },
        // Legacy mint for backward compat
        mint: {
          DEFAULT: '#4ECDC4',
          light: '#A8EDEA',
          50: '#f0fdfb',
          100: '#ccfaf5',
          200: '#99f5ec',
          300: '#66f0e3',
          400: '#4ECDC4',
          500: '#33b0a8',
        },
        // Neutral tones
        charcoal: '#2D3748',
        navy: '#1A202C',
        // UI primitives
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#FF6B9D',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#4FC3F7',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      fontFamily: {
        fredoka: ['"Fredoka One"', 'cursive'],
        nunito: ['Nunito', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '40px',
        full: '9999px',
      },

      boxShadow: {
        soft: '0 2px 12px rgba(0, 0, 0, 0.06)',
        card: '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 40px rgba(255, 107, 157, 0.2)',
        hover: '0 8px 32px rgba(0, 0, 0, 0.12)',
        pink: '0 4px 20px rgba(255, 107, 157, 0.35)',
        'pink-lg': '0 8px 32px rgba(255, 107, 157, 0.4)',
        blue: '0 4px 20px rgba(79, 195, 247, 0.35)',
        purple: '0 4px 20px rgba(199, 125, 255, 0.35)',
        yellow: '0 4px 20px rgba(255, 217, 61, 0.4)',
        green: '0 4px 20px rgba(107, 203, 119, 0.35)',
        coral: '0 4px 20px rgba(255, 139, 100, 0.35)',
        mint: '0 4px 20px rgba(78, 205, 196, 0.3)',
        glow: '0 0 20px rgba(255, 107, 157, 0.5)',
        float: '0 20px 60px rgba(0, 0, 0, 0.15)',
        inner: 'inset 0 2px 8px rgba(0, 0, 0, 0.06)',
      },

      backgroundImage: {
        // Hero gradients
        'gradient-hero': 'linear-gradient(135deg, #FFE0EC 0%, #E8F5FF 50%, #F0FFF4 100%)',
        'gradient-hero-2': 'linear-gradient(135deg, #FFF9C4 0%, #FCE4EC 50%, #E8EAF6 100%)',
        // Brand gradients
        'gradient-pink': 'linear-gradient(135deg, #FF6B9D 0%, #ff9cc0 100%)',
        'gradient-pink-v': 'linear-gradient(180deg, #FF6B9D 0%, #FFB3CC 100%)',
        'gradient-blue': 'linear-gradient(135deg, #4FC3F7 0%, #B3E5FC 100%)',
        'gradient-mint': 'linear-gradient(135deg, #4ECDC4 0%, #A8EDEA 100%)',
        'gradient-sunshine': 'linear-gradient(135deg, #FFD93D 0%, #FFF176 100%)',
        'gradient-lavender': 'linear-gradient(135deg, #C77DFF 0%, #E1BEE7 100%)',
        'gradient-coral': 'linear-gradient(135deg, #FF8B64 0%, #FFCCBC 100%)',
        'gradient-green': 'linear-gradient(135deg, #6BCB77 0%, #A8E6CF 100%)',
        // Rainbow
        'gradient-rainbow': 'linear-gradient(90deg, #FF6B9D, #FF8B64, #FFD93D, #6BCB77, #4FC3F7, #C77DFF)',
        // Shimmer
        shimmer: 'linear-gradient(90deg, #f8f8f8 0%, #f0f0f0 40%, #f8f8f8 100%)',
        // Soft card backgrounds
        'soft-pink': 'linear-gradient(135deg, #fff0f5 0%, #ffe8f0 100%)',
        'soft-blue': 'linear-gradient(135deg, #e8f4fd 0%, #dbeeff 100%)',
        'soft-yellow': 'linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)',
        'soft-green': 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)',
        'soft-purple': 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%)',
      },

      keyframes: {
        // System
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        // Floating elements
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(2deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(0px)' },
        },
        // Entrance animations
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Shimmer / skeleton
        shimmer: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
        // Scrolling marquee
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // Rainbow gradient shift
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Pulse ring (WhatsApp button, etc.)
        pulseRing: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(255, 107, 157, 0.5)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 12px rgba(255, 107, 157, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(255, 107, 157, 0)' },
        },
        // Wiggle
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        // Heartbeat
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.2)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.2)' },
          '70%': { transform: 'scale(1)' },
        },
        // Heart burst (wishlist)
        heartBurst: {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.35)' },
          '50%': { transform: 'scale(0.9)' },
          '75%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        // Confetti fall
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        // Cart fly
        cartFly: {
          '0%': { transform: 'scale(1) translate(0, 0)', opacity: '1' },
          '50%': { transform: 'scale(0.7) translate(30px, -40px)', opacity: '0.8' },
          '100%': { transform: 'scale(0.3) translate(80px, -80px)', opacity: '0' },
        },
        // Spin (for loaders)
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // Bounce
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-10%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        // Number flip (countdown)
        flipCard: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(-90deg)' },
          '100%': { transform: 'rotateX(0deg)' },
        },
        // Shine sweep
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '200%' },
        },
        // Rocket shake
        rocketShake: {
          '0%, 100%': { transform: 'translateX(0) rotate(45deg)' },
          '25%': { transform: 'translateX(-3px) rotate(42deg)' },
          '75%': { transform: 'translateX(3px) rotate(48deg)' },
        },
        // Pop
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
      },

      animation: {
        // System
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // Float
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 5s ease-in-out infinite',
        'float-delay': 'float 4s ease-in-out infinite 1s',
        'float-delay-2': 'float 4s ease-in-out infinite 2s',
        // Entrance
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        // Shimmer
        shimmer: 'shimmer 1.5s infinite linear',
        // Marquee
        marquee: 'marquee 20s linear infinite',
        'marquee-fast': 'marquee 12s linear infinite',
        // Gradient
        gradient: 'gradientShift 4s ease infinite',
        // Pulse ring
        'pulse-ring': 'pulseRing 2s infinite',
        'pulse-slow': 'pulseRing 3s infinite',
        // Wiggle + heartbeat
        wiggle: 'wiggle 0.5s ease-in-out',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
        'heart-burst': 'heartBurst 0.4s ease-out',
        // Other
        'cart-fly': 'cartFly 0.6s ease-in forwards',
        'confetti-fall': 'confettiFall 2s ease-in forwards',
        pop: 'pop 0.3s ease-out',
        shine: 'shine 0.8s ease-in-out',
        'rocket-shake': 'rocketShake 0.3s ease-in-out infinite',
        spin: 'spin 1s linear infinite',
      },

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },

      screens: {
        xs: '475px',
      },

      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-soft': 'cubic-bezier(0.37, 0, 0.63, 1)',
      },

      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
