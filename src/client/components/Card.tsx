import React from 'react';
import {Card, User, RuleParameters} from 'fluxxchat-protokolla';
import {FormattedMessage} from 'react-intl';
import {NumberParameter, PlayerParameter} from './CardParameters';
import './Card.scss';

interface ActiveCardProps {
	card: Card;
	users: User[];
}

interface OwnCardProps {
	cardId: string;
	card: Card;
	users: User[];
	action: (card: Card, ruleParameters: RuleParameters) => void;
}

interface OwnCardState {
	ruleParameters: RuleParameters;
}

export class ActiveCard extends React.Component<ActiveCardProps> {
	public render() {
		let parameter = '';
		let parameterAmount = 0;
		Object.keys(this.props.card.parameterTypes).forEach(key => {
			switch (this.props.card.parameterTypes[key]) {
				case 'player':
					if (parameterAmount === 0) {
						parameter += '(';
					} else if (parameterAmount > 0) {
						parameter += ', ';
					}
					parameterAmount++;
					let playerName = '';
					this.props.users.forEach(user => {
						if (this.props.card.parameters[key] === user.id) {
							playerName = user.nickname;
						}
					});
					parameter += playerName;
					break;
				case 'number':
					if (parameterAmount === 0) {
						parameter += '(';
					} else if (parameterAmount > 0) {
						parameter += ', ';
					}
					parameterAmount++;
					parameter += this.props.card.parameters[key];
					break;
				default:
					if (parameterAmount === 0) {
						parameter += '(';
					} else if (parameterAmount > 0) {
						parameter += ', ';
					}
					parameterAmount++;
					parameter += '';
					break;
			}
		});
		if (parameterAmount > 0) {
			parameter += ')';
		}
		return (
			<div className="card_container">
				<div className="card">
					<div className="card_name">
						{this.props.card.name} {parameter}
					</div>
					<div className="card_description">
						{this.props.card.description}
					</div>
				</div>
			</div>
		);
	}
}

export class OwnCard extends React.Component<OwnCardProps, OwnCardState> {
	public state: OwnCardState = {ruleParameters: {}};

	public handleClick = () => {
		this.props.action(this.props.card, this.state.ruleParameters);
	}

	public getParameterChangeHandler = (parameter: string) => (evt: React.ChangeEvent<any>) => {
		const value = evt.target.value;
		this.setState(state => ({
			ruleParameters: {
				...state.ruleParameters,
				[parameter]: value
			}
		}));
	}

	public render() {
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
					{Object.keys(this.props.card.parameterTypes).map(key => {
						switch (this.props.card.parameterTypes[key]) {
							case 'player':
								return (
									<div key={key} className="add_parameter_div">
										<FormattedMessage id="card.selectTarget"/>:
										<PlayerParameter
											users={this.props.users}
											onChange={this.getParameterChangeHandler(key)}
											value={this.state.ruleParameters[key]}
										/>
									</div>
								);
							case 'number':
								return (
									<div key={key} className="add_parameter_div">
										<FormattedMessage id="card.giveNumber"/>:
										<NumberParameter
											onChange={this.getParameterChangeHandler(key)}
											value={this.state.ruleParameters[key]}
										/>
									</div>
								);
							default:
								return null;
						}
					})}
					<button type="button" className="play_button" onClick={this.handleClick}>
						<FormattedMessage id="card.play"/>
					</button>
				</div>
			</div>
		);
	}
}
