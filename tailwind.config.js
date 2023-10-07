/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

export default {
    content: ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'search-gray': '#2C2C2C',
                'primary-red': '#AC1E11',
                primary: colors.blue,
                secondary: colors.slate,
            },
            boxShadow: {
                search: '0 0 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);',
            },
        },
    },
    plugins: [],
};
