/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme';

module.exports = {
	content: ['./views/**/*.{html,js,ejs}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				inter: ['Inter', ...fontFamily.sans],
				nunito: ['Nunito ', ...fontFamily.sans],
			},
			colors: {
				unand: {
					50: '#f1fcfa',
					100: '#cef9ef',
					200: '#9df2df',
					300: '#65e3cc',
					400: '#35ccb5',
					500: '#199f8d',
					600: '#138e80',
					700: '#147168',
					800: '#155a54',
					900: '#164b47',
					950: '#062d2b',
				},
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
