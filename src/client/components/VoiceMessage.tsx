import React from 'react';

interface Props {
	onVoiceMessageSend: (voiceMessage: any) => void;
}

interface State {
	audio: any;
}

export class VoiceMessage extends React.Component<Props, State> {
	public state = {audio: null};

	public async getMicrophone() {
		const audio = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false
		});
		this.setState({audio});
	}

	public stopMicrophone() {
		if (this.state.audio) {
			this.props.onVoiceMessageSend(this.state.audio);
			this.setState({audio: null});
		}
	}

	public render() {
		return (
			<div>
				<button onClick={this.stopMicrophone}>
					{this.state.audio ? 'Stop microphone' : 'Get microphone input'}
				</button>
			</div>
		);
	}
}
