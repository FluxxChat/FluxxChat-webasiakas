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
import {TextField, FormControl, InputLabel, Select} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';
import {User, RuleParameterType} from 'fluxxchat-protokolla';

interface Props {
	type: RuleParameterType;
	value: string;
	users: User[];
	onChange: React.ChangeEventHandler<HTMLSelectElement | HTMLInputElement>;
}

const CardParameterInput = ({type, value, users, onChange}: Props) => {
	if (Array.isArray(type)) {
		const choices = type as string[];
		return (
			<FormControl>
				<InputLabel><FormattedMessage id="card.selectValue"/></InputLabel>
				<Select
					native
					value={value}
					onChange={onChange}
				>
					{choices.map(c => (
						<option key={c} value={c}>{c}</option>
					))}
				</Select>
			</FormControl>
		);
	}

	if (type === 'player') {
		return (
			<FormControl>
				<InputLabel><FormattedMessage id="card.selectValue"/></InputLabel>
				<Select
					native
					value={value}
					onChange={onChange}
				>
					{users.map(u => (
						<option value={u.id}>{u.nickname}</option>
					))}
				</Select>
			</FormControl>
		);
	}

	if (type === 'number') {
		return (
			<TextField
				label={<FormattedMessage id="card.giveNumber"/>}
				value={value || 0}
				onChange={onChange}
				margin="normal"
				type="number"
			/>
		);
	}

	return null;
};

export default CardParameterInput;
