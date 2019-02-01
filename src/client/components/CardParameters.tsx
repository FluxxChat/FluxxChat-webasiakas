import React from 'react';
import { User } from 'fluxxchat-protokolla';

interface NumberParameterProps {
	cardId: string;
}

interface PlayerParameterProps {
	cardId: string;
	users: User[];
}

interface NumberParameteState {
	value: string;
}

interface PlayerParameteState {
	player: string;
}

export class NumberParameter extends React.Component<NumberParameterProps, NumberParameteState> {
	public state: NumberParameteState = {
		value: ''
	};

	public changeValue = event => {
		this.setState({value: event.target.value});
	}

	public render() {
		return (
			<div className="set_parameter_number">
				<input
					id={this.props.cardId}
					name="number_parameter"
					onChange={this.changeValue}
					value={this.state.value}
					className="set_parameter_number"
					type="text"
				/>
			</div>
		);
	}
}

export class PlayerParameter extends React.Component<PlayerParameterProps, PlayerParameteState> {
	public state: PlayerParameteState = {
		player: ''
	};

	public changeValue = event => {
		this.setState({player: event.target.value});
	}

	public render() {
		const options = (this.props.users.map((user, index) => {
			return (
				<option key={index} value={user.nickname}>{user.nickname}</option>
			);
		}));
		return (
				<select
					id={this.props.cardId}
					onChange={this.changeValue}
					placeholder={this.state.player}
					defaultValue="Select target"
					name="player_parameter"
					className="select_rule_target"
				>
				<option disabled>Select target</option>
					{options}
				</select>
		);
	}
}
