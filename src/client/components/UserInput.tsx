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
import {withStyles, createStyles, WithStyles, Theme, IconButton, InputBase, Divider} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import CardsIcon from '@material-ui/icons/ViewCarousel';
import {injectIntl, InjectedIntlProps} from 'react-intl';

const styles = (theme: Theme) => createStyles({
	root: {
		borderTop: `1px solid ${theme.fluxx.border.darker}`,
		borderRadius: '1rem',
		margin: '0.4rem 0.4rem',
		display: 'flex',
		alignItems: 'center',
		background: theme.fluxx.input.background
	},
	disabled: {
		borderTop: `1px solid ${theme.fluxx.border.darker}`,
		borderRadius: '1rem',
		margin: '0.4rem 0.4rem',
		display: 'flex',
		alignItems: 'center',
		background: theme.fluxx.input.disabledBackground
	},
	messageField: {
		flex: 1,
		padding: '12px 1rem',
		fontSize: '1.6rem',
		boxSizing: 'border-box',
		color: 'inherit'
	},
	sendButton: {
		color: theme.fluxx.input.sendButton.color
	},
	iconButton: {
		color: theme.fluxx.icon.primary
	}
});

interface OwnProps {
	value: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	valid: boolean;
	onToggleCards: () => void;
	onSend: () => void;
}

type Props = OwnProps & WithStyles<typeof styles> & InjectedIntlProps;

class UserInput extends React.Component<Props> {
	public handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			e.stopPropagation();
			this.props.onSend();
		}
	}

	public render() {
		const {value, onChange, valid, onToggleCards, onSend, classes, intl} = this.props;

		return (
			<div className={valid ? classes.root : classes.disabled}>
				<IconButton className={classes.iconButton} onClick={onToggleCards}>
					<CardsIcon/>
				</IconButton>
				<InputBase
					className={classes.messageField}
					placeholder={intl.formatMessage({id: 'input.typeMessage'})}
					onKeyDown={this.handleKeyDown}
					value={value}
					onChange={onChange}
					inputProps={{name: 'messageInput'}}
					multiline
				/>
				<Divider />
				<IconButton
					color="primary"
					className={classes.sendButton}
					onClick={onSend}
					disabled={!valid}
					name="messageSend"
				>
					<SendIcon/>
				</IconButton>
			</div>
		);
	}
}

export default withStyles(styles)(injectIntl(UserInput));
