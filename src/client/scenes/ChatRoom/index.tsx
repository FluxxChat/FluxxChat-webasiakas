import React from 'react';
import {Message} from 'fluxxchat-protokolla';
import '../../styles.css';
import {animateScroll} from 'react-scroll';
import {Card, OwnCard} from '../Card/card';
import MessageContainer from '../../components/MessageContainer';

interface Props {
	nickname: string;
	roomId: string;
	messages: Message[];
	onSendMessage: (message: string) => any;
}

interface State {
	messageDraft: string;
}

class ChatRoom extends React.Component<Props, State> {
	public state: State = {
		messageDraft: ''
	};

	public scrollToBottom() {
		animateScroll.scrollToBottom({
			containerId: 'message-box'
		});
	}

	public handleSendMessage = () => {
		const {messageDraft} = this.state;
		this.setState({messageDraft: ''}, () => {
			this.props.onSendMessage(messageDraft);
		});
	}

	public handleChangeMessageDraft = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({messageDraft: evt.target.value});
	}

	public handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault(); e.stopPropagation(); this.handleSendMessage();
		}
	}

	public playCard(action: string) {
		alert(action);
	}

	public render() {
		const {messages} = this.props;
		const {messageDraft} = this.state;

		return (
			<div className="chat_app">
				<div className="chat_area">
					<div className="message_box" id="message-box">
						{messages.map((msg, index) => {
							return (
								<MessageContainer 
									key={index}
									clientName={this.props.nickname}
									message={msg}
								/>
							);
						})}
					</div>
					<div>
						<form onKeyDown={this.handleKeyDown}>
						<input className="message_field" type="text" value={messageDraft} onChange={this.handleChangeMessageDraft}/>
							<div className="send_div">
								<button type="button" className="send_button" onClick={this.handleSendMessage}>Send</button>
							</div>
						</form>
					</div>
				</div >
				<div>
					<div className="turn_div">
						<div className="turn_text">
							It is someone's turn!
						</div>
					</div>
					<div className="card_div_active">
						<div className="caption">
							Active Cards
						</div>
						<Card content="this is a test" action={this.playCard}/>
					</div>
					<div className="card_div_own">
						<div className="caption">
							Your Cards
						</div>
						<OwnCard content="this is a test" action={this.playCard}/>
					</div>
				</div>
			</div>
		);
	}
}

export default ChatRoom;
