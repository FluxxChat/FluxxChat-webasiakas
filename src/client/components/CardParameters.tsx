import React from 'react';

interface NumberParameterProps {
	value: string;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => any;
}

interface ChoiceParameterProps {
	choices: Choice[];
	value: string;
	onChange: (evt: React.ChangeEvent<HTMLSelectElement>) => any;
}

interface Choice {
	display: string;
	id: string;
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

export class ChoiceParameter extends React.Component<ChoiceParameterProps> {
	public render() {
		return (
				<select
					value={this.props.value || '-1'}
					onChange={this.props.onChange}
					className="select_rule_target"
				>
					<option value="-1"/>>
					{this.props.choices.map(choice => (
						<option key={choice.id} value={choice.id}>{choice.display}</option>
					))}
				</select>
		);
	}
}
