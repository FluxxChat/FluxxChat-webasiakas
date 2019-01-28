import React from 'react';
import {Message, Card} from 'fluxxchat-protokolla';
import '../../styles.css';
import {animateScroll} from 'react-scroll';
import {ActiveCard, OwnCard} from '../../components/Card';

interface Props {
	nickname: string;
	roomId: string;
	messages: Message[];
	owncards: Card[];
	activecards: Card[];
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
							let message;
							switch (msg.type) {
								case 'NEW_RULE':
									message = `New Rule: ${msg.ruleName}`;
									break;
								case 'TEXT':
									let direction = '<';
									if (msg.senderNickname === this.props.nickname) {
										direction = '>';
									}
									message = `${msg.senderNickname} ${direction} ${msg.textContent}`;
									break;
								default:
									return null;
							}
							return (
								<div className="message" key={index}>{message}</div>
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
						{this.props.activecards.map((card, index) => {
							return (
								<ActiveCard key={index}
									cardName={card.name}
									cardDescription={card.description}
									parameterTypes={['number', 'number']}
									parameters={card.parameters}/>
							);
						})}
					</div>
					<div className="card_div_own">
						<div className="caption">
							Your Cards
						</div>
						{this.props.owncards.map((card, index) => {
							return (
								<OwnCard key={index}
									cardName={card.name}
									cardDescription={card.description}
									parameterTypes={['number', 'number']}
									parameters={card.parameters}
									action={this.playCard}/>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default ChatRoom;
