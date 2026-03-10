/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#1a0d0d',
          gold: '#e1c28d',
          bronze: '#a0816c',
          cream: '#f5ead4',
          red: '#c04040',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Outfit', 'sans-serif'],
        hand: ['"Shadows Into Light"', 'cursive'],
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(to bottom, rgba(26, 13, 13, 0.7), rgba(26, 13, 13, 0.9)), url('https://images.unsplash.com/photo-1503095396549-807039045349?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
      }
    },
  },
  plugins: [],
}
