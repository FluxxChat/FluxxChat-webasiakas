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
import ImageIcon from '@material-ui/icons/Image';

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
	focused: {}
});

interface OwnProps {
	value: {textContent: string, imageContent: string};
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	valid: boolean;
	inputMinHeight: number;
	imageMessages: boolean;
	onToggleCards: () => void;
	onSend: () => void;
	messageBlockedAnimation: (blocked: boolean) => void;
}

type Props = OwnProps & WithStyles<typeof styles> & InjectedIntlProps;

class UserInput extends React.Component<Props> {
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
		this.imageUploadRef.value = '';
	}

	public setPreviewImage = (evt: any) => {
		this.previewImageRef.src = URL.createObjectURL(evt.target.files[0]);
	}

	public openFileSelect = () => this.imageUploadRef.click();

	public onFileSelect = (event: any) => {
		this.setPreviewImage(event);
		this.props.onChange(event);
	}

	public setImageUploadRef = (imageUploadRef: any) => this.imageUploadRef = imageUploadRef;

	public setpreviewImageRef = (previewImageRef: any) => this.previewImageRef = previewImageRef;

	public render() {
		const {value, onChange, valid, inputMinHeight, imageMessages, onToggleCards, classes, intl} = this.props;

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
					<InputBase
						className={classes.messageField}
						placeholder={intl.formatMessage({id: 'input.typeMessage'})}
						onKeyDown={this.handleKeyDown}
						value={value.textContent}
						onChange={onChange}
						inputProps={{name: 'messageInput'}}
						rows={inputMinHeight}
						rowsMax={25}
						multiline
					/>
					<Divider />
					{imageMessages ? (
						<IconButton
							color="primary"
							className={classes.sendButton}
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
