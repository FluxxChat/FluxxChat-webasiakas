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
import 'emoji-mart/css/emoji-mart.css';
import {withStyles, createStyles, WithStyles, Theme, IconButton, InputBase, Divider, Popover, Paper, MenuItem, Popper, ClickAwayListener} from '@material-ui/core';
import {injectIntl, InjectedIntlProps, FormattedMessage} from 'react-intl';
import {Send, ViewCarousel, Face, Image, Mic, Delete} from '@material-ui/icons';
import {Picker} from 'emoji-mart';
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
	onInsertEmoji: (emoji: string) => void;
	valid: boolean;
	inputMinHeight: number;
	imageMessages: boolean;
	audioMessages: boolean;
	onMessageDraftChange: (event: MessageDraftChangeEvent) => void;
	threads: boolean;
	respondingTo: {senderId: string, senderNickname: string, timestamp: string} | null;
	emojiPicker: boolean;
	disableBackspace: boolean;
	suggestedWord: string;
	wordSuggestions: boolean;
	onToggleCards: () => void;
	onSend: () => void;
	messageBlockedAnimation: (blocked: boolean) => void;
	cancelResponse: () => void;
}

type Props = OwnProps & WithStyles<typeof styles> & InjectedIntlProps;

interface State {
	showEmojiSelector: boolean;
	emojiAnchorEl?: HTMLButtonElement;
	showWordSuggestion: boolean;
	audioMessageEnabled: boolean;
}

export type MessageDraftChangeEvent = TextMessageDraftChangeEvent | ImageMessageDraftChangeEvent | AudioMessageDraftChangeEvent;

interface TextMessageDraftChangeEvent {
	type: 'TEXT';
	newContent: string;
}

interface ImageMessageDraftChangeEvent {
	type: 'IMAGE';
	event: React.ChangeEvent<HTMLInputElement>;
}

interface AudioMessageDraftChangeEvent {
	type: 'AUDIO';
	newContent: {
		url: string;
		length: number;
	};
}

class UserInput extends React.Component<Props, State> {
	public state: State = {
		showEmojiSelector: false,
		showWordSuggestion: false,
		audioMessageEnabled: false
	};
	public inputRef: any;
	public imageUploadRef: HTMLInputElement;
	public previewImageRef: HTMLImageElement;

	public componentDidUpdate = prevProps => {
		if (this.props.value.textContent !== prevProps.value.textContent) {
			this.setState({showWordSuggestion: true});
		}
	}

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
		if (e.key === 'Tab' && this.props.wordSuggestions && this.state.showWordSuggestion && this.props.suggestedWord) {
			e.preventDefault();
			e.stopPropagation();
			this.selectPredictedWord();
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

	public textInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (!this.props.disableBackspace || event.target.value.startsWith(this.props.value.textContent)) {
			this.props.onMessageDraftChange({type: 'TEXT', newContent: event.target.value});
		}
	}

	public clearInput = () => {
		this.props.onMessageDraftChange({type: 'TEXT', newContent: ''});
	}

	public selectEmoji = (evt: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({showEmojiSelector: true, emojiAnchorEl: evt.currentTarget});
	}

	public closeEmojiSelector = () => {
		this.setState({showEmojiSelector: false});
	}

	public handleSelectEmoji = (emoji: any) => {
		this.setState({showEmojiSelector: false});
		this.props.onInsertEmoji(emoji.native);
	}

	public setPreviewImage = (evt: any) => {
		this.previewImageRef.src = URL.createObjectURL(evt.target.files[0]);
	}

	public openFileSelect = () => this.imageUploadRef.click();

	public onFileSelect = (event: any) => {
		this.setPreviewImage(event);
		this.props.onMessageDraftChange({type: 'IMAGE', event});
	}

	public setInputRef = (inputRef: React.RefObject<any>) => {this.inputRef = inputRef; };

	public setImageUploadRef = (imageUploadRef: any) => this.imageUploadRef = imageUploadRef;

	public setpreviewImageRef = (previewImageRef: any) => this.previewImageRef = previewImageRef;

	public changeAudioMessage = (url: string, length: number) => {
		this.props.onMessageDraftChange({type: 'AUDIO', newContent: {url, length}});
	}

	public beginAudioRecording = () => {
		this.setState({audioMessageEnabled: true});
	}

	public stopAudioRecording = () => {
		this.setState({audioMessageEnabled: false});
	}

	public selectPredictedWord = () => {
		let newText = this.props.value.textContent;
		if (newText.lastIndexOf(' ') !== newText.length - 1) {
			newText = newText + ' ';
		}
		newText = newText + this.props.suggestedWord + ' ';
		this.props.onMessageDraftChange({type: 'TEXT', newContent: newText});
	}

	public closeWordSuggestion = () => {
		this.setState({showWordSuggestion: false});
	}

	public render() {
		const {
			value,
			valid,
			inputMinHeight,
			imageMessages,
			audioMessages,
			threads,
			respondingTo,
			onToggleCards,
			cancelResponse,
			classes,
			intl,
			emojiPicker,
			disableBackspace,
			suggestedWord,
			wordSuggestions
		} = this.props;
		const {showWordSuggestion, audioMessageEnabled} = this.state;

		return (
			<div>
				{showWordSuggestion && suggestedWord && <Popper
					open={wordSuggestions && value.textContent.split(' ').length > 2}
					anchorEl={this.inputRef}
					placement="top"
					children={
						<Paper>
							<ClickAwayListener onClickAway={this.closeWordSuggestion}>
								<MenuItem onClick={this.selectPredictedWord}>
									{suggestedWord}
								</MenuItem>
							</ClickAwayListener>
						</Paper>
					}
				/>}
				<Popover
					open={this.state.showEmojiSelector}
					anchorEl={this.state.emojiAnchorEl}
					onClose={this.closeEmojiSelector}
				>
					<Picker
						onSelect={this.handleSelectEmoji}
						title={intl.formatMessage({id: 'input.selectEmoji'})}
						emoji="point_up_2"
					/>
				</Popover>
				<img
					className={classes.previewImage}
					ref={previewImageRef => this.previewImageRef = previewImageRef!}
					style={value.imageContent === '' ? {display: 'none'} : {display: 'block'}}
				/>
				<div className={valid ? classes.root : classes.disabled} >
					<IconButton className={classes.iconButton} onClick={onToggleCards}>
						<ViewCarousel/>
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
						inputRef={this.setInputRef}
						multiline
					/>
					<Divider />
					{emojiPicker ? (
						<IconButton
							color="primary"
							className={classes.sendButton}
							onClick={this.selectEmoji}
							name="selectEmoji"
						>
							<Face/>
						</IconButton>
					) : null}
					{audioMessages ? (
						audioMessageEnabled ? (
							<VoiceMessage
								classes={classes}
								changeMessageDraft={this.changeAudioMessage}
								onRemoveAudio={this.stopAudioRecording}
							/>
						) : (
							<IconButton  className={classes.iconButton} onClick={this.beginAudioRecording}>
								<Mic/>
							</IconButton>
						)
					) : null}
					{imageMessages ? (
						<IconButton
							color="primary"
							className={classes.iconButton}
							onClick={this.openFileSelect}
						>
							<Image/>
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
					{!valid && disableBackspace ? (
						<IconButton className={classes.iconButton} onClick={this.clearInput}>
							<Delete/>
						</IconButton>
					) : null}
					<IconButton
						color="primary"
						className={classes.sendButton}
						onClick={this.sendMessage}
						disabled={!valid}
						name="messageSend"
					>
						<Send/>
					</IconButton>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(injectIntl(UserInput));
