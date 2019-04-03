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
import {withStyles, createStyles, WithStyles, Theme, IconButton, InputBase, Divider, Popover} from '@material-ui/core';
import {injectIntl, InjectedIntlProps} from 'react-intl';
import {Send, ViewCarousel, Face, Image, Mic} from '@material-ui/icons';
import {Picker} from 'emoji-mart';
import VoiceMessage from './VoiceMessage';

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
	focused: {}
});

interface OwnProps {
	value: {textContent: string, imageContent: string};
	onInsertEmoji: (emoji: string) => void;
	valid: boolean;
	inputMinHeight: number;
	imageMessages: boolean;
	audioMessages: boolean;
	onMessageDraftChange: (type: 'TEXT' | 'IMAGE' | 'AUDIO', content: any) => void;
	emojiPicker: boolean;
	onToggleCards: () => void;
	onSend: () => void;
	messageBlockedAnimation: (blocked: boolean) => void;
}

type Props = OwnProps & WithStyles<typeof styles> & InjectedIntlProps;

interface State {
	showEmojiSelector: boolean;
	emojiAnchorEl?: HTMLButtonElement;
	audioMessageEnabled: boolean;
}

class UserInput extends React.Component<Props, State> {
	public state: State = {
		showEmojiSelector: false,
		audioMessageEnabled: false
	};
	public imageUploadRef: HTMLInputElement;
	public previewImageRef: HTMLImageElement;

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
		const {value, valid, inputMinHeight, imageMessages, audioMessages, onToggleCards, classes, intl, emojiPicker} = this.props;
		const {audioMessageEnabled} = this.state;

		return (
			<div>
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
				<div className={valid ? classes.root : classes.disabled}>
					<IconButton className={classes.iconButton} onClick={onToggleCards}>
						<ViewCarousel/>
					</IconButton>
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
