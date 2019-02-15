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
import {Message} from 'fluxxchat-protokolla';
import Remarkable from 'remarkable';
import {withStyles, createStyles, WithStyles, Theme} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
	right: {},
	left: {},
	messageContainer: {
		display: 'flex',
		'&$left': {
			justifyContent: 'flex-start'
		},
		'&$right': {
			justifyContent: 'flex-end'
		}
	},
	systemMessageContainer: {
		display: 'flex',
		justifyContent: 'center',
		'& > $message': {
			backgroundColor: '#f9ecb0'
		}
	},
	message: {
		margin: '0.2rem 1rem',
		padding: '0.6rem 1.2rem',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#ffffff',
		borderRadius: theme.fluxx.borderRadius
	},
	messageSender: {
		flex: '0 0 auto',
		fontWeight: 500,
		marginBottom: '0.4rem'
	},
	messageContent: {
		flex: 1,
		minWidth: '10rem',
		'& > :first-child': {
			marginTop: 0
		},
		'& > :last-child': {
			marginBottom: 0
		}
	}
});

interface Props extends WithStyles<typeof styles> {
	message: Message;
	clientName: string;
}

class MessageContainer extends React.Component<Props> {
	public render() {
		const {message, classes, clientName} = this.props;

		switch (message.type) {
			case 'SYSTEM':
			return (
					<div className={classes.systemMessageContainer}>
						<div className={classes.message}>
							<div className={classes.messageContent}>{message.message}</div>
						</div>
					</div>
				);
			case 'TEXT':
				const ownMessage = clientName === message.senderNickname;
				if (message.markdown) {
					const md = new Remarkable();
					return (
						<div className={`${classes.messageContainer} ${ownMessage ? classes.right : classes.left}`}>
							<div className={classes.message}>
								{!ownMessage && (
									<div className={classes.messageSender}>{message.senderNickname}</div>
								)}
								<div className={classes.messageContent} dangerouslySetInnerHTML={{__html: md.render(message.textContent)}}/>
							</div>
						</div>
					);
				} else {
					return (
						<div className={`${classes.messageContainer} ${ownMessage ? classes.right : classes.left}`}>
							<div className={classes.message}>
								{!ownMessage && (
									<div className={classes.messageSender}>{message.senderNickname}</div>
								)}
								<div className={classes.messageContent}>{message.textContent}</div>
							</div>
						</div>
					);
				}
			default:
				return null;
		}
	}
}

export default withStyles(styles)(MessageContainer);
