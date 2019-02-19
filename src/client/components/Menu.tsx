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
import {FormattedMessage} from 'react-intl';

interface Props {
	type: 'join' | 'create';
	onJoinRoom: (nickname: string) => any;
	onCreateRoom: (nickname: string) => any;
}

interface State {
	nickname: string;
}

class Menu extends React.Component<Props, State> {
	public state = {nickname: ''};

	public handleClickSubmit = () => {
		if (this.props.type === 'join') {
			this.props.onJoinRoom(this.state.nickname);
		} else {
			this.props.onCreateRoom(this.state.nickname);
		}
	}

	public handleChangeNickname = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({nickname: evt.target.value});
	}

	public render() {
		const {type} = this.props;

		return (
			<div>
				<span><FormattedMessage id="login.username"/>:</span>
				<input type="text" value={this.state.nickname} onChange={this.handleChangeNickname}/>
				<button onClick={this.handleClickSubmit}>
					{type === 'join' ? <FormattedMessage id="login.joinRoom"/> : <FormattedMessage id="login.createRoom"/>}
				</button>
			</div>
		);
	}
}

export default Menu;
