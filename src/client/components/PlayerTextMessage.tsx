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
import Linkify from 'linkifyjs/react';
import moment from 'moment';
import {withStyles, createStyles, WithStyles, Theme, IconButton} from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import PauseIcon from '@material-ui/icons/PauseCircleFilled';
import {FormattedMessage} from 'react-intl';
import MessageThread from './MessageThread';

const styles = (theme: Theme) => createStyles({
	own: {},
	threadLinkTrue: {},
	root: {
		minHeight: '54px',
		display: 'flex',
		justifyContent: 'flex-start',
		'&$own': {
			justifyContent: 'flex-end'
		}
	},
	message: {
		minWidth: '20rem',
		maxWidth: '90%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		fontSize: '1.2rem',
		margin: '0.2rem 1rem',
		padding: '0.8rem 1.2rem',
		background: theme.fluxx.chat.messages.message.background,
		borderRadius: theme.fluxx.chat.messages.message.borderRadius,
		overflow: 'auto',
		boxShadow: theme.fluxx.chat.messages.message.shadow,
		'$root$own &': {
			background: theme.fluxx.chat.messages.ownMessage.background
		}
	},
	messageLeftWrapper: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end'
	},
	messageRightWrapper: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		'&$threadLinkTrue': {
			justifyContent: 'space-between'
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
		wordBreak: 'break-word',
		'& > :first-child': {
			marginTop: 0
		},
		'& > :last-child': {
			marginBottom: 0
		}
	},
	imageContent: {
		maxWidth: '40rem',
		maxHeight: 'auto',
		paddingTop: '0.5rem',
		paddingBottom: '1rem'
	},
	audioRecordingWrapper: {
		fontSize: 16,
		display: 'flex',
		flexDirection: 'row',
		width: '14rem',
		background: theme.fluxx.border.darker,
		justifyContent: 'flex-start',
		borderRadius: '3rem',
		marginBottom: '1rem'
	},
	audioLengthText: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingLeft: '5px'
	},
	preformat: {
		whiteSpace: 'pre-wrap'
	},
	messageTimestamp: {
		display: 'flex',
		justifyContent: 'flex-end',
		fontSize: '1rem',
		opacity: 0.6
	},
	iconButton: {
		color: theme.fluxx.icon.primary
	},
	threadLinkWrapper: {
		width: '17rem',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	threadLink: {
		marginLeft: '1.5rem',
		marginBottom: '0.4rem',
		fontWeight: 600,
		fontSize: '1.2rem',
		textDecoration: 'underline',
		cursor: 'pointer',
		opacity: 0.6
	},
	responsesAmount: {
		marginBottom: '0.4rem',
		fontWeight: 600,
		fontSize: '1.2rem',
		opacity: 0.6
	}
});

interface Props extends WithStyles<typeof styles> {
	message: TextMessage;
	previousMessage?: TextMessage | SystemMessage;
	clientUser: User;
	threads: boolean;
	responses: TextMessage[];
	threadOpen: boolean;
	onToggleThread: (senderId: string, senderNickname: string, timestamp: string) => void;
}

interface State {
	audioPlayback: boolean;
}

class PlayerTextMessage extends React.Component<Props, State> {
	public state = {audioPlayback: false};
	public audioRef: any;

	public playAudioMessage = () => {
		this.audioRef.src = this.props.message.audioContent.url;
		this.audioRef.onloadedmetadata = (e: any) => {
			this.audioRef.play();
		};
		this.setState({audioPlayback: true});
	}

	public stopAudioMessage = () => {
		this.audioRef.src = null;
		this.setState({audioPlayback: false});
	}

	public openThread = () => {
		if (typeof this.props.message.senderId === 'string'
		&& typeof this.props.message.senderNickname === 'string'
		&& typeof this.props.message.timestamp === 'string') {
			this.props.onToggleThread(this.props.message.senderId, this.props.message.senderNickname, this.props.message.timestamp);
		}
	}

	public closeThread = () => {
		this.props.onToggleThread('', '', '');
	}

	public render() {
		const {message, previousMessage, clientUser, threads, responses, threadOpen, classes} = this.props;
		const showName = previousMessage
			? previousMessage.type !== 'TEXT' || previousMessage.senderId !== message.senderId
			: true;
		const ownMessage = clientUser.id === message.senderId;
		const md = new Remarkable('full', {
			linkify: true,
			typographer: true
		});

		return (
			<div className={`${classes.root} ${ownMessage ? classes.own : ''}`}>
				{threadOpen ? (
					<MessageThread
						message={message}
						clientUser={clientUser}
						responses={responses}
						onClose={this.closeThread}
					/>
				) : (
					<div className={classes.message}>
						<div className={classes.messageLeftWrapper}>
							{showName && (
								<div className={classes.messageSender}>
									{message.senderNickname}
								</div>
							)}
							{message.imageContent ? <img className={classes.imageContent} src={message.imageContent}/> : null}
							{message.audioContent.url ? (
								<div className={classes.audioRecordingWrapper}>
									<audio
										ref={audioElement => {this.audioRef = audioElement; }}
										onEnded={this.stopAudioMessage}
									/>
									<IconButton
										className={classes.iconButton}
										onClick={this.playAudioMessage}
										disabled={this.state.audioPlayback}
									>
										<PlayIcon/>
									</IconButton>
									<IconButton
										className={classes.iconButton}
										onClick={this.stopAudioMessage}
										disabled={!this.state.audioPlayback}
									>
										<PauseIcon/>
									</IconButton>
									<div className={classes.audioLengthText}>
										{message.audioContent.length + ' s'}
									</div>
								</div>
							) : null}
							<div className={classes.messageContainer}>
								{message.markdown ? (
									<div
										className={classes.messageContent}
										dangerouslySetInnerHTML={{__html: md.render(message.textContent)}}
									/>
								) : (
									<div className={classes.messageContent}>
										<div className={classes.preformat}><Linkify>{message.textContent}</Linkify></div>
									</div>
								)}
							</div>
						</div>
						<div className={`${classes.messageRightWrapper} ${threads ? classes.threadLinkTrue : ''}`}>
							{(threads || responses) && (
								<div className={classes.threadLinkWrapper}>
									<div className={classes.responsesAmount}>
										{responses && responses.length ? responses.length : ''}
									</div>
									<div className={classes.threadLink} onClick={this.openThread}>
										<FormattedMessage id="thread.open"/>
									</div>
								</div>
							)}
							<div className={classes.messageTimestamp}>
								{moment(message.timestamp).format('HH:mm')}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default withStyles(styles)(PlayerTextMessage);
