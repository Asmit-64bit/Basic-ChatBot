import botImage from '../assets/robot.png';
import userImage from '../assets/user.png';
import ReactMarkdown from 'react-markdown';
import './ChatMessage.css'

export function ChatMessage({ message, sender }) {
        return (
          <div className={sender==='user'? 'chat-message-user':'chat-message-bot'}>
            {sender === "bot" && <img src={botImage} className="chat-message-profile" />}
            <div className="chat-message-text">
            {sender === "bot" && typeof message === "string" ? (
              <ReactMarkdown>{message}</ReactMarkdown>
            ) : (
              message
            )}
            </div>
            {sender === "user" && <img src={userImage} className="chat-message-profile" />}
          </div>
        );
      }



      