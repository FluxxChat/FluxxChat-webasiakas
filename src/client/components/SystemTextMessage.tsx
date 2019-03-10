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
import {SystemMessage} from 'fluxxchat-protokolla';
import {withStyles, createStyles, WithStyles, Theme} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

const styles = (theme: Theme) => createStyles({
	root: {
		display: 'flex',
		justifyContent: 'center'
	},
	message: {
		margin: '0.2rem 1rem',
		padding: '0.8rem 1.2rem',
		display: 'flex',
		flexDirection: 'column',
		background: theme.fluxx.chat.messages.systemMessage.background,
		borderRadius: theme.fluxx.chat.messages.message.borderRadius,
		overflow: 'auto',
		boxShadow: theme.fluxx.chat.messages.message.shadow,
		'& img': {
			maxWidth: '30rem',
			maxHeight: '30rem'
		}
	},
	messageContent: {
		flex: 1,
		minWidth: '10rem',
		opacity: 0.8,
		wordBreak: 'break-word',
		'& > :first-child': {
			marginTop: 0
		},
		'& > :last-child': {
			marginBottom: 0
		}
	}
});

interface Props extends WithStyles<typeof styles> {
	message: SystemMessage;
}

const SystemTextMessage = ({message, classes}: Props) => {
	return (
		<div className={classes.root}>
			<div className={classes.message}>
				<div className={classes.messageContent}>
					<FormattedMessage id={message.message} values={message.values as {[key: string]: string } | undefined}/>
				</div>
			</div>
		</div>
	);
};

export default withStyles(styles)(SystemTextMessage);
