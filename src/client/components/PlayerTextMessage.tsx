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
import {User, TextMessage, SystemMessage} from 'fluxxchat-protokolla';
import Remarkable from 'remarkable';
import moment from 'moment';
import {withStyles, createStyles, WithStyles, Theme} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
	own: {},
	root: {
		display: 'flex',
		justifyContent: 'flex-start',
		'&$own': {
			justifyContent: 'flex-end'
		}
	},
	message: {
		display: 'flex',
		flexDirection: 'column',
		fontSize: '1.2rem',
		margin: '0.2rem 1rem',
		padding: '0.8rem 1.2rem',
		background: theme.fluxx.chat.messages.message.background,
		borderRadius: theme.fluxx.chat.messages.message.borderRadius,
		overflow: 'auto',
		boxShadow: theme.fluxx.chat.messages.message.shadow,
		'& img': {
			maxWidth: '30rem',
			maxHeight: '30rem'
		},
		'$root$own &': {
			background: theme.fluxx.chat.messages.ownMessage.background
		}
	},
	messageSender: {
		flex: '0 0 auto',
		fontWeight: 500,
		marginBottom: '0.4rem'
	},
	messageContainer: {
		display: 'flex',
		flexDirection: 'row',
		opacity: 0.8
	},
	messageContent: {
		flex: 1,
		minWidth: '10rem',
		wordBreak: 'break-word',
		'& > :first-child': {
			marginTop: 0
		},
		'& > :last-child': {
			marginBottom: 0
		}
	},
	preformat: {
		whiteSpace: 'pre'
	},
	messageTimestamp: {
		display: 'flex',
		alignItems: 'flex-end',
		marginLeft: '6rem',
		fontSize: '1rem',
		opacity: 0.6
	}
});

interface Props extends WithStyles<typeof styles> {
	message: TextMessage;
	previousMessage?: TextMessage | SystemMessage;
	clientUser: User;
}

const PlayerTextMessage = ({message, previousMessage, clientUser, classes}: Props) => {
	const showName = previousMessage
		? previousMessage.type !== 'TEXT' || previousMessage.senderId !== message.senderId
		: true;
	const ownMessage = clientUser.id === message.senderId;
	const md = new Remarkable();

	return (
		<div className={`${classes.root} ${ownMessage ? classes.own : ''}`}>
			<div className={classes.message}>
				{showName && (
					<div className={classes.messageSender}>
						{message.senderNickname}
					</div>
				)}
				<div className={classes.messageContainer}>
					{message.markdown ? (
						<div
							className={classes.messageContent}
							dangerouslySetInnerHTML={{__html: md.render(message.textContent)}}
						/>
					) : (
						<div className={classes.messageContent}>
							<div className={classes.preformat}>{message.textContent}</div>
						</div>
					)}
					<div className={classes.messageTimestamp}>
						{moment(message.timestamp).format('HH:mm')}
					</div>
				</div>
			</div>
		</div>
	);
};

export default withStyles(styles)(PlayerTextMessage);
