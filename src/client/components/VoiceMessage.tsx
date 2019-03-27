import React from 'react';
import {IconButton} from '@material-ui/core';
import StartRecIcon from '@material-ui/icons/FiberManualRecord';
import StopRecIcon from '@material-ui/icons/Stop';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import PauseIcon from '@material-ui/icons/PauseCircleFilled';
import CancelIcon from '@material-ui/icons/Cancel';

interface Props {
	classes: any;
	changeMessageDraft: (url: string, length: number) => void;
	onRemoveAudio: () => void;
}

interface State {
	recordingAudio: boolean;
	recordLength: number;
	dataUrl: string;
	audioPlayback: boolean;
}

class VoiceMessage extends React.Component<Props, State> {
	public state = {
		recordingAudio: false,
		recordLength: 0,
		dataUrl: '',
		audioPlayback: false
	};
	public mediaRecorder: MediaRecorder | null;
	public chunks: any[] = [];
	public audioRef: any;
	public maxRecordTimeInterval: NodeJS.Timeout;

	public startRecording = async () => {
		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({audio: true, video: false}).then((dataStream: MediaStream) => {
				this.mediaRecorder = new MediaRecorder(dataStream);
				this.mediaRecorder.ondataavailable = (data: any) => {
					this.chunks.push(data.data);
					this.mediaRecorder = null;
					const blob = new Blob(this.chunks);
					this.chunks = [];
					const reader = new FileReader();
					reader.onloadend = (e: any) => {
						this.setState({
							recordingAudio: false,
							dataUrl: 'data:audio/ogg;' + e.target.result.split(';')[1]
						});
						this.props.changeMessageDraft(this.state.dataUrl, this.state.recordLength);
					};
					reader.readAsDataURL(blob);
				};
				this.mediaRecorder.start();
				this.setState({recordingAudio: true, recordLength: 0});
				this.maxRecordTimeInterval = setInterval(() => {
					this.setState({recordLength: this.state.recordLength + 1});
					if (this.state.recordLength >= 60) {
						clearInterval(this.maxRecordTimeInterval);
						this.stopRecording();
					}
				}, 1000);
			});
		}
	};

	public stopRecording = () => {
		clearInterval(this.maxRecordTimeInterval);
		if (this.state.recordingAudio && this.mediaRecorder && this.state.recordLength > 0) {
			this.mediaRecorder.stop();
		} else {
			this.setState({
				recordingAudio: false,
				recordLength: 0,
				dataUrl: ''
			});
		}
	}

	public playAudioMessage = () => {
		this.audioRef.src = this.state.dataUrl;
		this.audioRef.onloadedmetadata = () => {
			this.audioRef.play();
		};
		this.setState({audioPlayback: true});
	}

	public stopAudioMessage = () => {
		this.audioRef.src = null;
		this.setState({audioPlayback: false});
	}

	public removeAudio = () => {
		this.audioRef.src = null;
		this.setState({recordLength: 0, dataUrl: ''});
		this.props.changeMessageDraft('', 0);
		this.props.onRemoveAudio();
		this.setState({audioPlayback: false});
	}

	public render() {
		const {classes} = this.props;
		const {recordingAudio, recordLength} = this.state;

		return (
			<div className={classes.audioRecordingWrapper}>
				<audio
					ref={audioElement => {this.audioRef = audioElement; }}
					onEnded={this.stopAudioMessage}
				/>
				<div className={classes.audioLengthText}>
					{recordLength + ' s'}
				</div>
				{(recordLength > 0  && !recordingAudio) ? (
					(this.state.audioPlayback) ? (
						<IconButton
							className={classes.iconButton}
							onClick={this.stopAudioMessage}
						>
							<PauseIcon/>
						</IconButton>
					) : (
						<IconButton
							className={classes.iconButton}
							onClick={this.playAudioMessage}
							disabled={recordingAudio}
						>
							<PlayIcon/>
						</IconButton>
					)
				) : null}
				{(recordLength > 0  && !recordingAudio) ? (
					<IconButton
						className={classes.iconButton}
						onClick={this.removeAudio}
					>
						<CancelIcon/>
					</IconButton>
				) : null}
				{(recordLength === 0 || recordingAudio) ? (
					<IconButton
						className={classes.iconButton}
						onClick={this.startRecording}
						disabled={recordingAudio}
					>
						<StartRecIcon/>
					</IconButton>
				) : null}
				{(recordLength === 0 || recordingAudio) ? (
					<IconButton
						className={classes.iconButton}
						onClick={this.stopRecording}
						disabled={!recordingAudio}
					>
						<StopRecIcon/>
					</IconButton>
				) : null}
			</div>
		);
	}
}

export default VoiceMessage;
