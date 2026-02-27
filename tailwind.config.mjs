/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'spfc-red': '#E2001A',
        'spfc-white': '#FFFFFF',
        'spfc-black': '#000000',
      },
    },
  },
  plugins: [],
};
