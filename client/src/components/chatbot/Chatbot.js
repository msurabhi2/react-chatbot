import React, { Component } from "react";
import axios from 'axios';
import Message from "./Messages";
import Card from "./Card";
import QuickReplies from "./QuickReplies";
import { useNavigate } from "react-router-dom";

class Chatbot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            showBot: true,
            showShopBot: false
        }
        this.inputRef = React.createRef();
        this._handleInputKeyPressed = this._handleInputKeyPressed.bind(this);
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);
    }

    show = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ showBot: true })
    }

    hide = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ showBot: false })
    }


    async df_text_query(text) {
        let says = {
            speaks: 'user',
            msg: {
                text: {
                    text: text
                }
            }
        }

        this.setState({ messages: [...this.state.messages, says] })
        const res = await axios.post('/api/df_text_query', { text })
        console.log("Response", res)

        let data = []
        for (let botMsg of res.data.fulfillmentMessages) {
            console.log("msg says", botMsg)
            says = {
                speaks: 'bot',
                msg: botMsg
            }
            data.push(says)
        }

        this.setState({
            messages: [...this.state.messages, ...data]
        });
    }

    async df_event_query(event) {
        const res = await axios.post('/api/df_event_query', { event })
        for (let msg of res.data.fulfillmentMessages) {
            let says = {
                speaks: 'bot',
                msg: msg
            }
            this.setState({ messages: [...this.state.messages, says] })
        }
    }

   resolveAfterXSeconds = (x) => {
     return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, x* 1000)
     })
   }

    componentDidMount() {
        this.df_event_query("Welcome");
        this.inputRef.current.focus();
    }

    async componentDidUpdate() {
        console.log("calling update")
        this.messageEnd.scrollIntoView({ behaviour: 'smooth' })

        if(window.location.pathname === '/shop' && !this.state.showShopBot){
             await this.resolveAfterXSeconds(1);
            this.setState({showShopBot: true, showBot: true});
            this.df_event_query("WELCOME_SHOP")
        }
        // console.log("history.location.pathname ", history, history.location.pathname )
        // history.listen(() => {
        //     console.log("history.location.pathname ", history.location.pathname )
        //     if (history.location.pathname === '/shop' && !this.state.showShopBot) {
        //         this.df_event_query('WELCOME_SHOP');
        //         this.setState({ showShopBot: true, showBot: true });
        //     }
        // });
    }

    renderCards(cards) {
        console.log("cards")
        return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
    }

    _handleQuickReplyPayload(event, payload, text) {
        event.preventDefault();
        event.stopPropagation();
        switch (payload) {
            case 'recommend_yes':
                this.df_event_query('SHOW_RECOMMENDATIONS');
            case 'training_masterclass':
                this.df_event_query('MASTERCLASS');
            default:
                this.df_text_query(text);
                break;
        }
    }

    renderOneMessage(message, i) {
        console.log("renderOneMessage", message)
        if (message.msg && message.msg.text && message.msg.text.text) {
            return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
        } else if (message.msg && message.msg.payload.fields.cards) {
            console.log("inside cards")
            //message.msg.payload.fields.cards.listValue.values
            return <div key={i}>
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{ overflow: 'hidden' }}>
                        <div className="col s2">
                            <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                        </div>
                        <div style={{ overflowX: 'scroll', overflowY: 'hidden' }}>
                            <div style={{ height: 300, width: 'max-content' }}>
                                {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields &&
            message.msg.payload.fields.quick_replies
        ) {
            return <QuickReplies
                text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                key={i}
                replyClick={this._handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.quick_replies.listValue.values} />;
        }
    };

    renderMessages(returnedMessages) {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return this.renderOneMessage(message, i)
            })
        } else {
            return null;
        }
    }

    _handleInputKeyPressed(e) {
        if (e.key == 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }

    render() {
        console.log("this.state.messages", this.state.messages)
        return (
            <React.Fragment>
                {this.state.showBot ?
                    <div style={{ minHeight: 500, maxHeight: 500, width: 400, position: 'absolute', right: 0, bottom: 0, border: '1px solid lightgrey' }}>
                        <nav>
                            <div className="nav-wrapper">
                                <a className="brand-logo">Chatbot</a>
                                <ul id="nav-mobile" className="right hide-on-med-and-down">
                                    <li><a href="/" onClick={this.hide}>Close</a></li>
                                </ul>
                            </div>
                        </nav>
                        <div id="chatbot" style={{ minHeight: 388, maxHeight: 388, width: '100%', overflow: 'auto' }}>
                            {this.renderMessages(this.state.messages)}
                            <div ref={(el) => { this.messageEnd = el; }}
                                style={{ float: 'left', clear: 'both' }}></div>
                        </div>
                        <div className="col s12">
                            <input style={{ margin: 0, paddingRight: '1%', paddingLeft: '1%', width: '98%' }}
                                placeholder={'Type your msg here'} ref={this.inputRef} type="text" onKeyPress={this._handleInputKeyPressed} />
                        </div>
                    </div>
                    : <div style={{ minHeight: 40, maxHeight: 500, width: 400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray' }}>
                        <nav>
                            <div className="nav-wrapper">
                                <a className="brand-logo">Chatbot</a>
                                <ul id="nav-mobile" className="right hide-on-med-and-down">
                                    <li><a href="/" onClick={this.show}>Show</a></li>
                                </ul>
                            </div>
                        </nav>
                        <div ref={(el) => { this.messageEnd = el; }}
                            style={{ float: 'left', clear: 'both' }}></div>
                    </div>
                }
            </React.Fragment>)
    }
}

export default function(props) {
    const navigate = useNavigate();
    return <Chatbot {...props} navigate={navigate}/>}