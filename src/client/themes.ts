import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeOptions} from '@material-ui/core/styles/createMuiTheme';
import {merge} from 'lodash';

interface CustomThemeProps {
	// Namespace custom themes so that they don't collide with Material UI themes accidentally
	fluxx: {
		palette: {
			primary: React.CSSProperties['color'],
			body: React.CSSProperties['color'],
			border: React.CSSProperties['color'],
			contrast: React.CSSProperties['color'],
			themeButton: React.CSSProperties['color'],
			themeSelectButton: React.CSSProperties['color'],
			themeSelectButtonHover: React.CSSProperties['color'],
			themeButtonHover: React.CSSProperties['color'],
			font: React.CSSProperties['color']
		};
	};
}

declare module '@material-ui/core/styles/createMuiTheme' {
	// Allow usage of custom theme
	interface Theme {
		fluxx: CustomThemeProps['fluxx'];
	}
	// Allow configuration using `createMuiTheme`
	interface ThemeOptions {
		fluxx: CustomThemeProps['fluxx'];
	}
}

// Utility function to add common theme options
const createTheme = (opts: ThemeOptions) => {
	return createMuiTheme(
		merge(opts, {
			typography: {
				// Needed to not get deprecation warnings in developer console
				useNextVariants: true
			}
		})
	);
};

export default {
	light: createTheme({
		fluxx: {
			// Custom themes
			palette: {
				body: 'white',
				primary: '#3A3A3A',
				border: '#3A3A3A',
				contrast: 'white',
				themeButton: '#303030',
				themeSelectButton: 'white',
				themeSelectButtonHover: '#cdcdcd',
				themeButtonHover: '#262626',
				font: 'black'
			}
		}
	}),
	red: createTheme({
		fluxx: {
			// Custom themes
			palette: {
				body: '#ebebeb',
				primary: 'darkred',
				border: '#282828',
				contrast: '#ebebeb',
				themeButton: '#770000',
				themeSelectButton: '#ebebeb',
				themeSelectButtonHover: '#d7d7d7',
				themeButtonHover: '#590000',
				font: 'black'
			}
		}
	})
};

export const themeNames = ['Light', 'Red'];
