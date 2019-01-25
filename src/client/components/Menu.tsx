import React from 'react';

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
				<span>Username:</span>
				<input type="text" value={this.state.nickname} onChange={this.handleChangeNickname}/>
				<button onClick={this.handleClickSubmit}>
					{type === 'join' ? 'Join Room' : 'Create Room'}
				</button>
			</div>
		);
	}
}

export default Menu;
