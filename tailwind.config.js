/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF8A65',
          light: '#FFCCBC',
          dark: '#F4511E',
        },
        success: '#81C784',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        text: {
          primary: '#212121',
          secondary: '#757575',
        },
      },
    },
  },
  plugins: [],
}
