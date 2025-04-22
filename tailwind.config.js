// tailwind.config.js
const { heroui } = require('@heroui/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{jsx,js,ts,tsx,css}",
    "./node_modules/@heroui/theme/dist/components/(button|input|select|skeleton|ripple|spinner|form|listbox|divider|popover|scroll-shadow).js"
  ],
	theme: {
		extend: {},
	},
	darkMode: 'class',
	plugins: [heroui()],
};
