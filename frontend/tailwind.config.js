/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {screens: {
        'tableCollapse': '915px', // when screen width >=900px, use desktop/table layout
        'finaltableCollapse': '880px', // when screen width >=900px, use desktop/table layout
      },

      },
    },
    plugins: [],
  }
  