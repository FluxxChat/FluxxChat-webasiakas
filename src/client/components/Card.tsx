import React from 'react';
import '../styles.css';
import { RuleParameterTypes, RuleParameters } from 'fluxxchat-protokolla';

interface Props {
	cardName: string;
	cardDescription: string;
	parameterTypes: RuleParameterTypes;
	parameters: RuleParameters;
	action?: any;
}

interface State {
	users: string[];
}

export class ActiveCard extends React.Component<Props, State> {

	public render() {
		let parameter;
		Object.keys(this.props.parameterTypes).forEach(key => {
			switch (this.props.parameterTypes[key]) {
				case 'player':
					parameter += '\nThis card effects ' + this.props.parameters[key];
					break;
				case 'number':
					parameter += '\nSelected value is ' + this.props.parameters[key];
					break;
				default:
					parameter += '';
					break;
			}
		});
		return (
			<div className="card_container">
				<div className="card">
					<div className="card_name">
						{this.props.cardName}
					</div>
					<div className="card_description">
						{this.props.cardDescription + parameter}
					</div>
				</div>
			</div>
		);
	}
}

export class OwnCard extends React.Component<Props, State> {

	public handleClick = () => {
		this.props.action();
	}

	public render() {
		let playButton = <div/>;
		Object.keys(this.props.parameterTypes).forEach(key => {
			switch (this.props.parameterTypes[key]) {
				case 'player':
					const options: any[] = [];
					this.state.users.forEach(user => {
						options.push(<option value={user}>{user}</option>);
					});
					playButton = (
						<div className="add_parameter_div">
							Select target:
							<select className="select_rule_target">
								{options}
							</select>
							{playButton}
						</div>
					);
					break;
				case 'number':
					playButton = (
						<div className="add_parameter_div">
							Give number:
							<input className="set_parameter_number" type="text"/>>
							{playButton}
						</div>
					);
					break;
				case '':
					playButton = (
						<div className="play_buttons_container">
							{playButton}
							<button type="button" className="play_button" onClick={this.handleClick}>Play</button>
						</div>
					);
					break;
			}
		});
		return (
			<div className="card_container">
				<div className="card">
					<div className="card_name">
						{this.props.cardName}
					</div>
					<div className="card_description">
						{this.props.cardDescription}
					</div>
				</div>
				{playButton}
			</div>
		);
	}
}
