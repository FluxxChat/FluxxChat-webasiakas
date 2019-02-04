import React from 'react';
import { User } from 'fluxxchat-protokolla';

interface NumberParameterProps {
	value: string;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => any;
}

interface PlayerParameterProps {
	users: User[];
	value: string;
	onChange: (evt: React.ChangeEvent<HTMLSelectElement>) => any;
}

export class NumberParameter extends React.Component<NumberParameterProps> {
	public render() {
		return (
			<span>
				<input
					onChange={this.props.onChange}
					value={this.props.value || 0}
					className="set_parameter_number"
					type="number"
				/>
			</span>
		);
	}
}

export class PlayerParameter extends React.Component<PlayerParameterProps> {
	public render() {
		return (
				<select
					value={this.props.value || '-1'}
					onChange={this.props.onChange}
					className="select_rule_target"
				>
					<option value="-1"/>>
					{this.props.users.map(user => (
						<option key={user.id} value={user.id}>{user.nickname}</option>
					))}
				</select>
		);
	}
}
