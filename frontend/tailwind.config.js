/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        keyframes: {
          bounce: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          }
        },
        animation: {
          bounce: 'bounce 1s infinite',
          'bounce-delay': 'bounce 1s infinite 0.2s',
        }
      }
    },
    plugins: [],
  }
  