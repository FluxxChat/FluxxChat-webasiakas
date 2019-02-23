import React from 'react';
import ReactAvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import {FormattedMessage} from 'react-intl';
import {Button} from '@material-ui/core';

interface ImageEditorProps {
	classes: any;
	image: string;
	onChangeAvatar: (image: string) => void;
}

interface ImageEditorState {
	scale: number;
}

export class ImageEditor extends React.Component<ImageEditorProps, ImageEditorState> {
	public state = {scale: 1.2};
	public editor: any;

	public onClickSave = () => {
		if (this.editor) {
			let imageURL: string;
			fetch(this.editor.getImage().toDataURL()).then(res => res.blob()).then(blob => {
				imageURL = window.URL.createObjectURL(blob);
				this.props.onChangeAvatar(imageURL);
			});
		}
	}

	public onMouseScroll = scroll => {
		if (this.state.scale > 0.5 && scroll.deltaY < 0) {
			this.setState({scale: this.state.scale + (scroll.deltaY / 2000)});
		} else if (this.state.scale < 3.0 && scroll.deltaY > 0) {
			this.setState({scale: this.state.scale + (scroll.deltaY / 2000)});
		}
	}

	public setEditorRef = editor => this.editor = editor;

	public render() {
		const {classes, image} = this.props;

		return (
			<div>
				<div onWheel={this.onMouseScroll}>
					<ReactAvatarEditor
						ref={this.setEditorRef}
						image={image}
						width={250}
						height={250}
						border={50}
						color={(this.props.image === '') ? [0, 0, 0, 0] : [255, 255, 255, 0.5]} // RGBA
						scale={this.state.scale}
						rotate={0}
					/>
				</div>
				<Button className={classes.avatarEditorBtn} onClick={this.onClickSave}>
					<FormattedMessage id="avatar.confirm"/>
				</Button>
			</div>
		);
	}
}

interface DragDropHandlerProps {
	classes: any;
	onChangeAvatar: (image: string) => void;
}

interface DragDropHandlerState {
	image: any;
}

export class DragDropHandler extends React.Component<DragDropHandlerProps, DragDropHandlerState> {
	public state = {image: ''};

	public handleDrop = dropped => {
		this.setState({image: dropped[0]});
	}

	public render() {
		const {classes, onChangeAvatar} = this.props;

		return (
			<section>
				<Dropzone onDrop={this.handleDrop}>
					{({getRootProps, getInputProps}) => (
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<Button className={classes.avatarEditorBtn}>
								<FormattedMessage id="avatar.upload"/>
							</Button>
						</div>
					)}
				</Dropzone>
				<ImageEditor
					classes={classes}
					image={this.state.image}
					onChangeAvatar={onChangeAvatar}
				/>
			</section>
		);
	}
}
