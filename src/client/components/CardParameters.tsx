/* FluxxChat-webasiakas
 * Copyright (C) 2019 Helsingin yliopisto
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

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
