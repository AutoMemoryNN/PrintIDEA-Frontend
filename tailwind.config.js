// tailwind.config.js
const { heroui } = require('@heroui/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{jsx,js,ts,tsx,css}",
    "./node_modules/@heroui/theme/dist/components/(button|date-picker|input|select|skeleton|ripple|spinner|calendar|date-input|form|popover|listbox|divider|scroll-shadow).js"
  ],
	theme: {
		extend: {},
	},
	darkMode: 'class',
	plugins: [heroui()],
};
