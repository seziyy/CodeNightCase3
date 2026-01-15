/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        turkcell: {
          primary: '#183E93',
          blue: '#183E93',
          navy: '#0F2A5F',
          yellow: '#FFC800',
          gray: '#F5F5F5',
        },
        risk: {
          low: '#22C55E',
          medium: '#EAB308',
          high: '#EF4444',
        },
      },
    },
  },
  plugins: [],
}
