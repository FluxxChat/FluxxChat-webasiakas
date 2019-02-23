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

import React from 'react';
import {withStyles, createStyles, WithStyles, Theme, Tooltip, IconButton, Menu, MenuItem, Popover} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';
import ThemeIcon from '@material-ui/icons/ColorLens';
import AvatarIcon from '@material-ui/icons/AccountCircle';
import LocaleIcon from '@material-ui/icons/Language';
import localeData from '../../../i18n/data.json';
import themes from '../themes';
import {DragDropHandler} from './ProfileImgEditor';

const styles = (theme: Theme) => createStyles({
	root: {
		fontSize: '1.4rem',
		fontWeight: 500,
		flex: '0 0 5rem',
		display: 'flex',
		padding: '0 1rem',
		justifyContent: 'flex-end',
		alignItems: 'center',
		background: theme.fluxx.chat.header.background,
		borderBottom: `1px solid ${theme.fluxx.border.darker}`,
		'& button': {
			width: '4rem',
			height: '4rem',
			padding: '0.4rem',
			color: theme.fluxx.icon.primary
		}
	},
	avatarEditor: {
		width: '350px',
		paddingLeft: '8px',
		paddingRight: '8px',
		background: theme.fluxx.profileImgEditor.background
	},
	avatarEditorBtn: {
		height: '50px',
		width: '350px',
		marginTop: '8px',
		marginBottom: '8px',
		lineHeight: '1.75',
		fontFamily: 'Montserrat, helvetica, arial, sans-serif',
		fontSize: '1.6rem',
		fontWeight: 500,
		textTransform: 'uppercase',
		background: theme.fluxx.profileImgEditor.button.background,
		color: theme.fluxx.profileImgEditor.button.color,
		boxShadow: theme.fluxx.profileImgEditor.button.shadow,
		borderRadius: '0.8rem',
		cursor: 'pointer',
		transition: 'box-shadow 0.2s',
		'& button': {
			whiteSpace: 'nowrap'
		},
		'&$focused': {
			boxShadow: theme.fluxx.profileImgEditor.button.focus.shadow
		}
	},
	focused: {}
});

interface Props extends WithStyles<typeof styles> {
	onChangeTheme: (theme: keyof typeof themes) => void;
	onChangeLocale: (locale: keyof typeof localeData) => void;
	onChangeAvatar: (image: string) => void;
}

interface State {
	anchorEl: any;
	showThemeMenu: boolean;
	showLocaleMenu: boolean;
	showAvatarEditor: boolean;
}

class Header extends React.Component<Props, State> {
	public state: State = {
		anchorEl: null,
		showThemeMenu: false,
		showLocaleMenu: false,
		showAvatarEditor: false
	};

	public handleClickThemeBtn = (evt: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({showThemeMenu: true, anchorEl: evt.currentTarget});
	}

	public handleCloseThemeMenu = () => {
		this.setState({showThemeMenu: false, anchorEl: null});
	}

	public getThemeSelectHandler = (theme: keyof typeof themes) => () => {
		this.props.onChangeTheme(theme);
		this.handleCloseThemeMenu();
	}

	public handleClickLocaleBtn = (evt: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({showLocaleMenu: true, anchorEl: evt.currentTarget});
	}

	public handleCloseLocaleMenu = () => {
		this.setState({showLocaleMenu: false, anchorEl: null});
	}

	public getLocaleSelectHandler = (locale: keyof typeof localeData) => () => {
		this.props.onChangeLocale(locale);
		this.handleCloseLocaleMenu();
	}

	public handleClickAvatarBtn = (evt: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({showAvatarEditor: true, anchorEl: evt.currentTarget});
	}

	public handleCloseAvatarMenu = () => {
		this.setState({showAvatarEditor: false, anchorEl: null});
	}

	public handleAvatarChange = (image: string) => {
		this.props.onChangeAvatar(image);
		this.setState({showAvatarEditor: false, anchorEl: null});
	}

	public render() {
		const {classes} = this.props;
		const {anchorEl, showThemeMenu, showLocaleMenu, showAvatarEditor} = this.state;

		return (
			<div className={classes.root}>
				<Tooltip title={<FormattedMessage id="tooltip.changeAvatar"/>} placement="left" disableFocusListener>
					<IconButton onClick={this.handleClickAvatarBtn}>
						<AvatarIcon/>
					</IconButton>
				</Tooltip>
				<Tooltip title={<FormattedMessage id="tooltip.changeLocale"/>} placement="left" disableFocusListener>
					<IconButton onClick={this.handleClickLocaleBtn}>
						<LocaleIcon/>
					</IconButton>
				</Tooltip>
				<Tooltip title={<FormattedMessage id="tooltip.changeTheme"/>} placement="left" disableFocusListener>
					<IconButton onClick={this.handleClickThemeBtn}>
						<ThemeIcon/>
					</IconButton>
				</Tooltip>
				<Menu
					anchorEl={anchorEl}
					open={showThemeMenu}
					onClose={this.handleCloseThemeMenu}
				>
					<MenuItem onClick={this.getThemeSelectHandler('light')}>
						<FormattedMessage id="theme.light"/>
					</MenuItem>
					<MenuItem onClick={this.getThemeSelectHandler('dark')}>
						<FormattedMessage id="theme.dark"/>
					</MenuItem>
				</Menu>
				<Menu
					anchorEl={anchorEl}
					open={showLocaleMenu}
					onClose={this.handleCloseLocaleMenu}
				>
					<MenuItem onClick={this.getLocaleSelectHandler('fi')}>
						FI
					</MenuItem>
					<MenuItem onClick={this.getLocaleSelectHandler('en')}>
						EN
					</MenuItem>
				</Menu>
				<Popover
					anchorEl={anchorEl}
					open={showAvatarEditor}
					onClose={this.handleCloseAvatarMenu}
				>
					<div className={classes.avatarEditor}>
						<DragDropHandler
							classes={classes}
							onChangeAvatar={this.handleAvatarChange}
						/>
					</div>
				</Popover>
			</div>
		);
	}
}

export default withStyles(styles)(Header);
