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
		text: {primary: React.CSSProperties['color']},
		icon: {primary: React.CSSProperties['color']},
		body: {background: React.CSSProperties['background']},
		border: {darker: React.CSSProperties['color']},
		menu: {
			input: {background: React.CSSProperties['background']},
			button: {color: React.CSSProperties['color']}
		}
		controlArea: {background: React.CSSProperties['background']},
		chat: {
			header: {background: React.CSSProperties['background']},
			messages: {
				message: {
					borderRadius: React.CSSProperties['borderRadius'],
					background: React.CSSProperties['background'],
					shadow: React.CSSProperties['boxShadow']
				},
				ownMessage: {background: React.CSSProperties['background']},
				systemMessage: {
					background: React.CSSProperties['background'],
					fontWeight: React.CSSProperties['fontWeight']
				}
			}
		},
		cards: {
			background: React.CSSProperties['background'],
			card: {
				borderRadius: React.CSSProperties['borderRadius'],
				background: React.CSSProperties['background'],
				shadow: React.CSSProperties['boxShadow'],
				hover: {shadow: React.CSSProperties['boxShadow']}
			}
		},
		input: {
			background: React.CSSProperties['background'],
			sendButton: {color: React.CSSProperties['color']}
		},
		users: {
			background: React.CSSProperties['background'],
			user: {highlight: {background: React.CSSProperties['background']}}
		}
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
	chat: {messages: {message: {borderRadius: '0.6rem'}}},
	cards: {card: {borderRadius: '0.6rem'}}
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
		overrides: {MuiTooltip: {tooltip: {fontWeight: 500}}}
	}));
};

export default {
	light: createTheme({
		fluxx: merge(commonFluxxStyles, {
			text: {primary: '#000000de'},
			icon: {primary: '#0000008a'},
			border: {darker: '#0000001a'},
			body: {background: '#efefef'},
			menu: {
				input: {background: '#ffffffcc'},
				button: {color: '#39a5d2'}
			},
			controlArea: {background: '#fafafa'},
			chat: {
				header: {background: '#ffffff44'},
				messages: {
					message: {
						background: '#ffffff',
						shadow: '0 1px 1px #0000002e'
					},
					ownMessage: {background: '#d8e3ea'},
					systemMessage: {
						background: '#f9ecb0',
						fontWeight: 400
					}
				}
			},
			cards: {
				background: '#f4f4f4',
				card: {
					background: '#ffffff',
					shadow: '0.1rem 0.1rem 0.4rem 0 #00000022',
					hover: {shadow: '0 0 0.4rem 0.1rem #0099ffaa'}
				}
			},
			input: {
				background: '#f4f4f4',
				sendButton: {color: '#3f51b5'}
			},
			users: {
				background: 'linear-gradient(160deg, #2d3a59 0%, #171c29 100%)',
				user: {highlight: {background: 'linear-gradient(90deg, #222d4800 0%, #222d48 100%)'}}
			}
		})
	}),
	dark: createTheme({
		fluxx: merge(commonFluxxStyles, {
			text: {primary: '#ffffffcc'},
			icon: {primary: '#ffffffcc'},
			border: {darker: '#00000033'},
			body: {background: '#465375'},
			menu: {
				input: {background: '#00000033'},
				button: {color: '#90a5c3d6'}
			},
			controlArea: {background: '#313d5a'},
			chat: {
				header: {background: '#29334c'},
				messages: {
					message: {
						background: '#0000002e',
						shadow: '0 1px 1px #0000007a'
					},
					ownMessage: {background: '#465d8a'},
					systemMessage: {
						background: '#3c50b6',
						fontWeight: 500
					}
				}
			},
			cards: {
				background: '#00000022',
				card: {
					background: '#ffffff22',
					shadow: '0.1rem 0.1rem 0.2rem 0 #00000078',
					hover: {shadow: '0 0 0.4rem 0.1rem #adddfdaa'}
				}
			},
			input: {
				background: '#00000033',
				sendButton: {color: '#8cb6cc'}
			},
			users: {
				background: 'linear-gradient(160deg, #2d3a59 0%, #171c29 100%)',
				user: {highlight: {background: 'linear-gradient(90deg, #222d4800 0%, #222d48 100%)'}}
			}
		})
	})
};
