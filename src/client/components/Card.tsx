import React from 'react';
import '../styles.css';
import {Card} from 'fluxxchat-protokolla';
import { FormattedMessage } from 'react-intl';

interface ActiveCardProps {
	card: Card;
}

interface OwnCardProps {
	card: Card;
	action: (card: Card) => void;
}

interface State {
	users: string[];
}

export class ActiveCard extends React.Component<ActiveCardProps, State> {

	public render() {
		let parameter;
		Object.keys(this.props.card.parameterTypes).forEach(key => {
			switch (this.props.card.parameterTypes[key]) {
				case 'player':
					parameter += '\nThis card effects ' + this.props.card.parameters[key];
					break;
				case 'number':
					parameter += '\nSelected value is ' + this.props.card.parameters[key];
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
						{this.props.card.name}
					</div>
					<div className="card_description">
						{this.props.card.description + parameter}
					</div>
				</div>
			</div>
		);
	}
}

export class OwnCard extends React.Component<OwnCardProps, State> {

	public handleClick = () => {
		this.props.action(this.props.card);
	}

	public render() {
		const parameters: JSX.Element[] = [];
		Object.keys(this.props.card.parameterTypes).forEach(key => {
			switch (this.props.card.parameterTypes[key]) {
				case 'player':
					const options: any[] = [];
					this.state.users.forEach(user => {
						options.push(<option value={user}>{user}</option>);
					});
					parameters.push(
						<div key="1" className="add_parameter_div">
							<FormattedMessage id="card.selectTarget"/>:
							<select className="select_rule_target">
								{options}
							</select>
						</div>
					);
					break;
				case 'number':
				parameters.push(
						<div key="2" className="add_parameter_div">
							<FormattedMessage id="card.giveNumber"/>:
							<input className="set_parameter_number" type="text"/>
						</div>
					);
				break;
			}
		});
		return (
			<div className="card_container">
				<div className="card">
					<div className="card_name">
						{this.props.card.name}
					</div>
					<div className="card_description">
						{this.props.card.description}
					</div>
				</div>
				<div className="play_buttons_container">
					{parameters}
					<button type="button" className="play_button" onClick={this.handleClick}><FormattedMessage id="card.play"/></button>
				</div>
			</div>
		);
	}
}
