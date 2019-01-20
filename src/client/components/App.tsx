import React from 'react';
import ChatRoom from '../scenes/ChatRoom';

interface State {
	nickname: string | null;
	nicknameValue: string;
}

class App extends React.Component<{}, State> {
	public state: State = {
		nickname: null,
		nicknameValue: ''
	};

	public handleChangeNickname = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({nicknameValue: evt.target.value});
	}

	public handleSelectNickname = () => {
		this.setState(state => ({nickname: state.nicknameValue}));
	}

	public render() {
		const {nickname} = this.state;

		return (
			<div>
				{!nickname && (
					<div>
						<span>Username:</span>
						<input type="text" value={this.state.nicknameValue} onChange={this.handleChangeNickname}/>
						<button onClick={this.handleSelectNickname}>OK</button>
					</div>
				)}
				{nickname && (
					<ChatRoom
						nickname={nickname}
						roomId=""
					/>
				)}
			</div>
		);
	}
}

export default App;
