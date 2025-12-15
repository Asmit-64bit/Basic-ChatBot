import { useState } from 'react';
import { ChatInput } from './components/ChatInput';
import { ChatMessages } from './components/ChatMessages';
import './App.css'
 
function App() {
        const [chatMessages, setChatMessages] = useState([]);
        //const chatMessages = array[0];
        //const setChatMessages = array[1];

        /*function sendMessage(){
            chatMessages.push({
                message:'test,',
                sender:'user',
                id: crypto.randomUUID()
            });
            console.log(chatMessages);
            setChatMessages([
                ...chatMessages,
                {
                    message:'test',
                    sender:'user',
                    id: crypto.randomUUID()
                }
            ])
        }*/
        return (
          <div className="app-container">
            {chatMessages.length === 0 && (<p className="welcome-msg">Welcome to the Chatbot project! Send a message using the textbox below.</p>)}
            <ChatMessages chatMessages={chatMessages} />
            <ChatInput
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
            />
          </div>
        );
      }

export default App
