import React from 'react';
import {Message, Card, User, RuleParameters} from 'fluxxchat-protokolla';
import '../../styles.css';
import {animateScroll} from 'react-scroll';
import {ActiveCard, OwnCard} from '../../components/Card';
import MessageContainer from '../../components/MessageContainer';
import { FormattedMessage } from 'react-intl';

interface Props {
	nickname: string;
	roomId: string;
	users: User[];
	messages: Message[];
	ownCards: Card[];
	activeCards: Card[];
	onSendMessage: (message: string) => void;
	onSendNewRule: (card: Card, ruleParameters: RuleParameters) => void;
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
								<button type="button" className="send_button" onClick={this.handleSendMessage}>
									<FormattedMessage id="room.send"/>
								</button>
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
							<FormattedMessage id="room.activeCards"/>
						</div>
						{this.props.activeCards.map((card, index) => {
							return (
								<ActiveCard
									key={index}
									card={card}
								/>
							);
						})}
					</div>
					<div className="card_div_own">
						<div className="caption">
							<FormattedMessage id="room.hand"/>
						</div>
						{this.props.ownCards.map((card, index) => {
							return (
								<OwnCard
									key={index}
									cardId={index.toString()}
									card={card}
									users={this.props.users}
									action={this.props.onSendNewRule}
								/>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default ChatRoom;
