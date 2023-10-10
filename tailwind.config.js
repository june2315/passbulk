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
                'primary-red': '#D40101',
                primary: colors.blue,
                secondary: colors.slate,
            },
            boxShadow: {
                search: '0 0 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);',
            },
            animation: {
                'fade-in':
                    'fadeIn 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0s 1 forwards',
                'fade-out':
                    'fadeOut 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0s 1 forwards',
            },
            keyframes: {
                fadeIn: {
                    from: {
                        opacity: 0,
                        top: '-30px',
                    },
                    to: {
                        opacity: 1,
                        top: 0,
                    },
                },
                fadeOut: {
                    from: {
                        opacity: 1,
                        top: 0,
                    },
                    to: {
                        opacity: 0,
                        top: '-30px',
                    },
                },
            },
        },
    },
    plugins: [],
};
