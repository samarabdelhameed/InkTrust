/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#0F1115",
          lighter: "#161920",
          accent: "#1F232B",
        },
        primary: {
          DEFAULT: "#3B82F6",
          neon: "#00F5FF",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          neon: "#BD00FF",
        },
        accent: {
          green: "#00FF94",
          pink: "#FF00E5",
          orange: "#FF8A00",
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'neon-gradient': 'linear-gradient(90deg, #00F5FF 0%, #BD00FF 100%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00F5FF, 0 0 10px #00F5FF' },
          '100%': { boxShadow: '0 0 20px #00F5FF, 0 0 40px #00F5FF' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
