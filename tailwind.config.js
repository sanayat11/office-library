/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6B46C1', // Primary
                    hover: '#9F7AEA',   // Primary hover
                    active: '#553C9A',  // Primary active
                },
                status: {
                    available: '#48BB78',
                    reserved: '#ECC94B',
                    borrowed: '#F56565',
                }
            }
        },
    },
    plugins: [],
}
