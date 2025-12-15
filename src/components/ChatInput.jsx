import { useState } from 'react'
import { Chatbot } from 'supersimpledev'
import loading from '../assets/loading-spinner.gif'
import './ChatInput.css'


export function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  async function sendMessage() {
    if (isLoading || inputText === "") {
      return;
    }
    setIsLoading(true);
    setInputText("");
    const newChatMessages = [
      ...chatMessages,
      {
        message: inputText,
        sender: "user",
        id: crypto.randomUUID(),
      },
    ];
    setChatMessages(newChatMessages);
    setChatMessages([
      ...newChatMessages,
      {
        message: <img src={loading} className="loading-spinner" />,
        sender: "bot",
        id: crypto.randomUUID(),
      },
    ]);
    const response = await Chatbot.getResponseAsync(inputText);
    setChatMessages([
      ...newChatMessages,
      {
        message: response,
        sender: "bot",
        id: crypto.randomUUID(),
      },
    ]);
    setIsLoading(false);
  }
  return (
    <div className="chat-input-container">
      <input
        placeholder="Send a message to Chatbot"
        size="30"
        className="text-box"
        onChange={saveInputText}
        value={inputText}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            sendMessage();
          } else if (event.key === "Escape") {
            setInputText("");
          }
        }}
      />
      <button onClick={sendMessage} className="send-button">
        Send
      </button>
    </div>
  );
}
