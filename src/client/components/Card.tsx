import React from 'react';
import '../styles.css';

interface Props {
	content: string;
	action: any;
}

export class ActiveCard extends React.Component<Props> {

	public render() {
		return (
			<div className="card">
				{this.props.content}
			</div>
		);
	}
}

export class OwnCard extends React.Component<Props> {

	public handleClick = () => {
		this.props.action(this.props.content);
	}

	public render() {
		return (
			<div className="card">
				{this.props.content}
				<button type="button" className="play_button" onClick={this.handleClick}>Play</button>
			</div>
		);
	}
}
