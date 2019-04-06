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
import ImageIcon from '@material-ui/icons/InsertPhoto';
import MicrophoneIcon from '@material-ui/icons/Mic';
import {injectIntl, InjectedIntlProps, FormattedMessage} from 'react-intl';
import VoiceMessage from './VoiceMessage';
import moment from 'moment';
import CancelIcon from '@material-ui/icons/Cancel';

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
	messageFieldContainer: {
		flex: 1
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
	},
	previewImage: {
		maxHeight: '30rem',
		maxWidth: '30rem',
		paddingTop: '10px',
		paddingLeft: '60px'
	},
	audioRecordingWrapper: {
		display: 'flex',
		flexDirection: 'row',
		width: '15rem',
		background: theme.fluxx.border.darker,
		justifyContent: 'flex-end',
		borderRadius: '3rem'
	},
	audioLengthText: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingRight: '5px'
	},
	threadResponseWrapper: {
		display: 'flex',
		flexDirection: 'row',
		background: theme.fluxx.border.darker,
		justifyContent: 'flex-end',
		borderRadius: '3rem'
	},
	threadResponseInfoContainer: {
		alignSelf: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end'
	},
	threadResponseInfo: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	threadResponseLabel: {
		fontSize: '1.2rem',
		marginLeft: '3.2rem',
		opacity: 0.8
	},
	messageSender: {
		alignSelf: 'center',
		marginLeft: '1.5rem',
		marginRight: '1rem',
		opacity: 0.8
	},
	messageTimestamp: {
		alignSelf: 'center',
		fontSize: '1rem',
		opacity: 0.7
	},
	focused: {}
});

interface OwnProps {
	value: {textContent: string, imageContent: string};
	valid: boolean;
	inputMinHeight: number;
	imageMessages: boolean;
	audioMessages: boolean;
	threads: boolean;
	respondingTo: {senderId: string, senderNickname: string, timestamp: string} | null;
	onMessageDraftChange: (type: 'TEXT' | 'IMAGE' | 'AUDIO', content: any) => void;
	onToggleCards: () => void;
	onSend: () => void;
	messageBlockedAnimation: (blocked: boolean) => void;
	cancelResponse: () => void;
}

interface State {
	audioMessageEnabled: boolean;
}

type Props = OwnProps & WithStyles<typeof styles> & InjectedIntlProps;

class UserInput extends React.Component<Props, State> {
	public state = {audioMessageEnabled: false};
	public imageUploadRef: any;
	public previewImageRef: any;

	public handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			if (!this.props.valid) {
				this.props.messageBlockedAnimation(true);
				const waitTime = setInterval(() => {
					clearInterval(waitTime);
					this.props.messageBlockedAnimation(false);
				}, 300);
			}
			e.preventDefault();
			e.stopPropagation();
			this.sendMessage();
		}
	}

	public sendMessage = () => {
		this.props.onSend();
		if (this.imageUploadRef) {
			this.imageUploadRef.value = '';
		}
		if (this.state.audioMessageEnabled) {
			this.setState({audioMessageEnabled: false});
		}
	}

	public textInputChange = (event: any) => {
		this.props.onMessageDraftChange('TEXT', event);
	}

	public setPreviewImage = (evt: any) => {
		this.previewImageRef.src = URL.createObjectURL(evt.target.files[0]);
	}

	public openFileSelect = () => this.imageUploadRef.click();

	public onFileSelect = (event: any) => {
		this.setPreviewImage(event);
		this.props.onMessageDraftChange('IMAGE', event);
	}

	public setImageUploadRef = (imageUploadRef: any) => this.imageUploadRef = imageUploadRef;

	public setpreviewImageRef = (previewImageRef: any) => this.previewImageRef = previewImageRef;

	public changeAudioMessage = (url: string, length: number) => {
		this.props.onMessageDraftChange('AUDIO', {url, length});
	}

	public beginAudioRecording = () => {
		this.setState({audioMessageEnabled: true});
	}

	public stopAudioRecording = () => {
		this.setState({audioMessageEnabled: false});
	}

	public render() {
		const {value, valid, inputMinHeight, imageMessages, audioMessages, threads, respondingTo, onToggleCards, cancelResponse, classes, intl} = this.props;
		const {audioMessageEnabled} = this.state;

		return (
			<div>
				<img
					className={classes.previewImage}
					ref={previewImageRef => this.previewImageRef = previewImageRef}
					style={value.imageContent === '' ? {display: 'none'} : {display: 'block'}}
				/>
				<div className={valid ? classes.root : classes.disabled}>
					<IconButton className={classes.iconButton} onClick={onToggleCards}>
						<CardsIcon/>
					</IconButton>
					{threads && respondingTo && respondingTo.senderId && (
						<div className={classes.threadResponseWrapper}>
							<div className={classes.threadResponseInfoContainer}>
								<div className={classes.threadResponseLabel}>
									<FormattedMessage id="thread.responseLabel"/>
								</div>
								<div className={classes.threadResponseInfo}>
									<div className={classes.messageSender}>
										{respondingTo.senderNickname}
									</div>
									<div className={classes.messageTimestamp}>
										{moment(respondingTo.timestamp).format('HH:mm')}
									</div>
								</div>
							</div>
							<IconButton
								className={classes.iconButton}
								onClick={cancelResponse}
							>
								<CancelIcon/>
							</IconButton>
						</div>
					)}
					<InputBase
						className={classes.messageField}
						placeholder={intl.formatMessage({id: 'input.typeMessage'})}
						onKeyDown={this.handleKeyDown}
						value={value.textContent}
						onChange={this.textInputChange}
						inputProps={{name: 'messageInput'}}
						rows={inputMinHeight}
						rowsMax={25}
						multiline
					/>
					<Divider />
					{audioMessages ? (
						audioMessageEnabled ? (
							<VoiceMessage
								classes={classes}
								changeMessageDraft={this.changeAudioMessage}
								onRemoveAudio={this.stopAudioRecording}
							/>
						) : (
							<IconButton  className={classes.iconButton} onClick={this.beginAudioRecording}>
								<MicrophoneIcon/>
							</IconButton>
						)
					) : null}
					{imageMessages ? (
						<IconButton
							color="primary"
							className={classes.iconButton}
							onClick={this.openFileSelect}
						>
							<ImageIcon/>
							<input
								type="file"
								onChange={this.onFileSelect}
								ref={this.setImageUploadRef}
								style={{display: 'none'}}
								multiple={false}
								accept="image/*"
							/>
						</IconButton>
					) : null}
					<IconButton
						color="primary"
						className={classes.sendButton}
						onClick={this.sendMessage}
						disabled={!valid}
						name="messageSend"
					>
						<SendIcon/>
					</IconButton>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(injectIntl(UserInput));
