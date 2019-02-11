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
			contrast: React.CSSProperties['color']
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
				primary: 'black',
				border: 'black',
				contrast: 'white'
			}
		}
	})
};
