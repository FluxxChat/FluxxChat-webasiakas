import React from 'react';
import { FormattedMessage } from 'react-intl';

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
