import React, { useState, useEffect, useRef } from "react";
import classes from "./ChatModal.module.css";
import { io } from "socket.io-client";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";

const QUICK_REPLIES = [
  "Ship phí bao nhiêu vậy bạn?",
  "Có freeship không ạ?",
  "Cho mình hỏi giá món này ạ?",
  "Mình ở ĐHQG, ship được không?",
];

const ChatModal = ({ isOpen, onClose, seller, prefillMessage }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const socketRef = useRef(null);
  const chatBoxRef = useRef(null);
  const { fetchPersonalDetails } = useLocationLocalStorage();

  useEffect(() => {
    if (!isOpen) return;

    const personalDetails = fetchPersonalDetails();
    if (!personalDetails) {
      setChatHistory([{ sender: "system", text: "Vui lòng đăng nhập để nhắn tin cho người bán." }]);
      return;
    }

    const userId = personalDetails.data.id;
    const roomId = `${userId}_${seller.restaurantId}`;

    // Connect to socket
    socketRef.current = io(import.meta.env.VITE_REACT_BACKEND_URL);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join_room", roomId);
    });

    socketRef.current.on("receive_message", (data) => {
      setChatHistory((prev) => [...prev, { sender: data.senderId === userId ? "buyer" : "seller", text: data.text }]);
    });

    // Fetch old chat history
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/chat/${roomId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            const history = json.data.map(msg => ({
              sender: msg.senderId === userId ? "buyer" : "seller",
              text: msg.text
            }));
            setChatHistory(history);
          } else {
            setChatHistory([{ sender: "seller", text: `Xin chào! 👋 Bạn cần hỏi gì không ạ?` }]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch chat history");
      }
    };
    fetchHistory();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isOpen, seller.restaurantId]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const personalDetails = fetchPersonalDetails();
    if (!personalDetails || !socketRef.current) return;

    const userId = personalDetails.data.id;
    const roomId = `${userId}_${seller.restaurantId}`;

    const msgData = {
      roomId,
      senderId: userId,
      text: message,
      timestamp: new Date()
    };

    socketRef.current.emit("send_message", msgData);
    setMessage("");
  };

  const handleQuickReply = (text) => {
    setMessage(text);
  };

  return (
    <div className={classes.overlay} onClick={onClose}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <div className={classes.header}>
          <div>
            <h3>💬 Nhắn tin người bán</h3>
            <p>{seller?.isOnline ? "🟢" : "🔴"} {seller?.name}</p>
          </div>
          <button className={classes.closeBtn} onClick={onClose}>✕</button>
        </div>
        
        <div className={classes.chatBox} ref={chatBoxRef}>
          {prefillMessage && chatHistory.length <= 1 && (
            <div className={classes.systemMsg}>
              Bạn đang hỏi về: <strong>{prefillMessage}</strong>
            </div>
          )}
          {chatHistory.map((msg, idx) => (
            <div 
              key={idx} 
              className={`${classes.message} ${msg.sender === "buyer" ? classes.msgBuyer : (msg.sender === "system" ? classes.msgSystem : classes.msgSeller)}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className={classes.quickReplies}>
          {QUICK_REPLIES.map((reply, idx) => (
            <span key={idx} className={classes.chip} onClick={() => handleQuickReply(reply)}>
              {reply}
            </span>
          ))}
        </div>

        <form onSubmit={handleSend} className={classes.inputArea}>
          <input 
            type="text" 
            placeholder="Nhập tin nhắn..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" disabled={!message.trim()}>➤</button>
        </form>

        <div className={classes.footer}>
          <p>📞 Hoặc gọi: {seller?.phone}</p>
          <div className={classes.socialBtns}>
            <button onClick={() => window.open(`https://zalo.me/${seller?.phone}`)}>Mở Zalo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
