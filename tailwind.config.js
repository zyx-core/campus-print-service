/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neo-cyan': '#00D9FF',
                'neo-yellow': '#FFD700',
                'neo-pink': '#FF6B9D',
                'neo-orange': '#FF8C42',
                'neo-cream': '#FFFEF2',
                'neo-border': '#000000',
            },
            fontFamily: {
                'sans': ['"Fredoka"', 'sans-serif'],
                'fredoka': ['"Fredoka"', 'sans-serif'],
            },
            boxShadow: {
                'neo': '6px 6px 0px 0px #000000',
                'neo-lg': '8px 8px 0px 0px #000000',
                'neo-sm': '4px 4px 0px 0px #000000',
            },
        },
    },
    plugins: [],
}
