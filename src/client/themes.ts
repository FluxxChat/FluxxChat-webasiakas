/* FluxxChat-webasiakas
 * Copyright (C) 2019 Helsingin yliopisto
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeOptions} from '@material-ui/core/styles/createMuiTheme';
import {merge} from 'lodash';

interface CustomThemeProps {
	// Namespace custom themes so that they don't collide with Material UI themes accidentally
	fluxx: {
		borderRadius: React.CSSProperties['borderRadius'],
		palette: {
			primary: React.CSSProperties['color'],
			foreground: React.CSSProperties['color'],
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

const commonFluxxStyles = {
	borderRadius: '0.2rem'
};

// Utility function to add common theme options
const createTheme = (opts: ThemeOptions) => {
	return createMuiTheme(merge(opts, {
		typography: {
			// Needed to not get deprecation warnings in developer console
			useNextVariants: true,
			htmlFontSize: 10,
			fontFamily: 'Montserrat, Helvetica, Arial'
		},
		overrides: {
			MuiTooltip: {
				tooltip: {
					fontWeight: 500
				}
			}
		}
	}));
};

export default {
	light: createTheme({
		fluxx: {
			...commonFluxxStyles,
			// Custom themes
			palette: {
				body: '#efefef',
				foreground: '#ffffff',
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
			...commonFluxxStyles,
			// Custom themes
			palette: {
				body: '#ebebeb',
				foreground: '#ebebeb',
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
