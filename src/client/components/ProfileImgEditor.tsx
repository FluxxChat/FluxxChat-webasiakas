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
import ReactAvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import {FormattedMessage} from 'react-intl';
import {Button} from '@material-ui/core';
import {Slider} from '@material-ui/lab';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';

interface ImageEditorProps {
	classes: any;
	image: string;
	onChangeAvatar: (image: string) => void;
}

interface ImageEditorState {
	scale: number;
	sliderValue: number;
}

export class ImageEditor extends React.Component<ImageEditorProps, ImageEditorState> {
	public state = {scale: 1.2, sliderValue: 50};
	public editor: any;

	public setDefaultImage = () => {
		this.props.onChangeAvatar('default');
	}

	public onClickSave = () => {
		if (this.editor) {
			fetch(this.editor.getImage().toDataURL()).then(dataURL => {
				this.props.onChangeAvatar(dataURL.url);
			});
		}
	}

	public onMouseScroll = (scroll: any) => {
		const x = this.state.scale + (scroll.deltaY / 2000);
		if (this.state.scale >= 0.5 && scroll.deltaY < 0) {
			this.setState({
				scale: this.state.scale + (scroll.deltaY / 2000),
				sliderValue: -46.1905 + 101.111 * x - 17.4603 * x * x
			});
		} else if (this.state.scale <= 3.0 && scroll.deltaY > 0) {
			this.setState({
				scale: this.state.scale + (scroll.deltaY / 2000),
				sliderValue: -46.1905 + 101.111 * x - 17.4603 * x * x
			});
		}
	}

	public handleSliderChange = (event: any, sliderValue: number) => {
		this.setState({
			scale: 0.5 + 0.003 * sliderValue + 0.00022 * sliderValue * sliderValue,
			sliderValue
		});
	}

	public setEditorRef = (editor: any) => this.editor = editor;

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
				<div className={classes.ImageEditorButtonContainer}>
					{(this.props.image === '') ? (
						<Button className={classes.avatarEditorBtn} onClick={this.setDefaultImage}>
							<FormattedMessage id="avatar.setDefault"/>
						</Button>
					) : (
						<div className={classes.imageEditorZoomContainer}>
							<div className={classes.imageEditorZoomIcon}>
								<ZoomOut/>
							</div>
							<div className={classes.imageEditorZoomSlider}>
								<Slider value={this.state.sliderValue} onChange={this.handleSliderChange}/>
							</div>
							<div className={classes.imageEditorZoomIcon}>
								<ZoomIn/>
							</div>
						</div>
					)}
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

	public handleDrop = (dropped: any) => {
		this.setState({image: dropped[0]});
	}

	public setDropzoneProps = ({getRootProps, getInputProps}) => (
		<div {...getRootProps()}>
			<input {...getInputProps()} />
			<Button className={this.props.classes.avatarEditorBtn}>
				<FormattedMessage id="avatar.upload"/>
			</Button>
		</div>
	)

	public render() {
		const {classes, onChangeAvatar} = this.props;

		return (
			<section>
				<Dropzone onDrop={this.handleDrop}>
					{this.setDropzoneProps}
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
