import botImage from '../assets/robot.png';
import userImage from '../assets/user.png';
import './ChatMessage.css'

export function ChatMessage({ message, sender }) {
        /*const {message}= props;
        return sender === "bot" ? (
            <div>
                <img src="images/robot.png" width="30" height="fit content"/>
                {message}
            </div>
        ) : (
            <div>
                {message}
                <img src="images/user.png" width="30" height="fit content"/>
            </div>
        );*/
        return (
          <div className={sender==='user'? 'chat-message-user':'chat-message-bot'}>
            {sender === "bot" && <img src={botImage} className="chat-message-profile" />}
            <div className="chat-message-text">
            {message}
            </div>
            {sender === "user" && <img src={userImage} className="chat-message-profile" />}
          </div>
        );
      }



      