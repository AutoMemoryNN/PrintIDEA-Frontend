// tailwind.config.js
const { heroui } = require('@heroui/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./node_modules/@heroui/theme/dist/components/(button|ripple|spinner).js',
		'./app/**/*.{jsx,js,ts,tsx,css}',
	],
	theme: {
		extend: {},
	},
	darkMode: 'class',
	plugins: [heroui()],
};
