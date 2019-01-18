import React from 'react';
import {TextMessage, NewRuleMessage} from 'fluxxchat-protokolla';
import Home from '../scenes/Home';

interface State {
	socket: WebSocket | null;
	status: string;
	messages: Array<TextMessage | NewRuleMessage>;
}

class App extends React.Component<{}, State> {
	public state: State = {
		socket: null,
		status: '',
		messages: []
	};

	public componentDidMount() {
		const socket = new WebSocket('ws://localhost:3030');

		socket.addEventListener('open', () => {
			const msg: TextMessage = {
				type: 'TEXT',
				textContent: 'herranjestas',
				senderNickname: 'SomeDude'
			};

			socket.send(JSON.stringify(msg));
			this.setState({socket, status: 'Connected to server'});
		});

		socket.addEventListener('close', () => {
			this.setState({socket: null, status: 'Connection lost'});
		});

		socket.addEventListener('message', evt => {
			const msg: TextMessage | NewRuleMessage = JSON.parse(evt.data);
			this.setState({messages: [...this.state.messages, msg]});
		});
	}

	public componentWillUnmount() {
		const socket = this.state.socket;
		if (socket) {
			socket.close();
		}
	}

	public render() {
		return (
			<div>
				{this.state.status}
				<Home messages={this.state.messages}/>
			</div>
		);
	}
}

export default App;
