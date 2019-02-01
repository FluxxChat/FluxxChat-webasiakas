import React from 'react';
import '../styles.css';
import {Card, User} from 'fluxxchat-protokolla';
import {FormattedMessage} from 'react-intl';
import {NumberParameter, PlayerParameter} from './CardParameters';

interface ActiveCardProps {
	card: Card;
}

interface OwnCardProps {
	cardId: string;
	card: Card;
	users: User[];
	action: (card: Card) => void;
}

export class ActiveCard extends React.Component<ActiveCardProps> {

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

export class OwnCard extends React.Component<OwnCardProps> {

	public handleClick = () => {
		let validateNumberInput = true;
		const numberParameters = document.getElementsByName('number_parameter');
		if (numberParameters.length > 0) {
			numberParameters.forEach(element => {
				if (element.getAttribute('id') === this.props.cardId) {
					validateNumberInput = false;
					if ((element.getAttribute('value') + '').length > 0 && parseInt(element.getAttribute('value') + '', 10) > 0) {
						validateNumberInput = true;
						this.props.card.parameters = {length: parseInt(element.getAttribute('value') + '', 10)};
					}
				}
			});
		}
		let validatePlayerInput = true;
		const playerParameters = document.getElementsByName('player_parameter');
		if (playerParameters.length > 0) {
			playerParameters.forEach(element => {
				if (element.getAttribute('id') === this.props.cardId) {
					validatePlayerInput = false;
					if (element.getAttribute('placeholder') !== '') {
						validatePlayerInput = true;
						this.props.card.parameters = {target: element.getAttribute('placeholder')};
					}
				}
			});
		}
		if (validateNumberInput === true && validatePlayerInput === true) {
			this.props.action(this.props.card);
		}
	}

	public render() {
		const parameters: JSX.Element[] = [];
		Object.keys(this.props.card.parameterTypes).forEach(key => {
			switch (this.props.card.parameterTypes[key]) {
				case 'player':
					parameters.push(
						<div key="1" className="add_parameter_div">
							<FormattedMessage id="card.selectTarget"/>:
							<PlayerParameter cardId={this.props.cardId} users={this.props.users}/>
						</div>
					);
					break;
				case 'number':
					parameters.push(
						<div key="2" className="add_parameter_div">
							<FormattedMessage id="card.giveNumber"/>:
							<NumberParameter cardId={this.props.cardId}/>
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
