import React, { useState, useEffect, useRef } from "react";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";
import { io } from "socket.io-client";
import classes from "./SellerInbox.module.css";

const SellerInbox = () => {
  const { fetchRestaurantId, fetchPersonalDetails } = useLocationLocalStorage();
  const restaurantId = fetchRestaurantId();
  const personalDetails = fetchPersonalDetails();
  
  const [conversations, setConversations] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  const chatBoxRef = useRef(null);

  // Fetch Inbox list
  const fetchInbox = async () => {
    if (!restaurantId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/seller/inbox/${restaurantId}`);
      if (res.ok) {
        const json = await res.json();
        setConversations(json.conversations || []);
      }
    } catch (err) {
      console.error("Failed to fetch inbox", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
    // Setup socket for receiving updates
    socketRef.current = io(import.meta.env.VITE_REACT_BACKEND_URL);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [restaurantId]);

  // Handle active room change
  useEffect(() => {
    if (!activeRoom || !socketRef.current) return;

    // Join new room
    socketRef.current.emit("join_room", activeRoom.roomId);

    // Fetch history
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/chat/${activeRoom.roomId}`);
        if (res.ok) {
          const json = await res.json();
          setChatHistory(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch chat history");
      }
    };
    fetchHistory();

    // Mark as read
    if (activeRoom.unreadCount > 0) {
      fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/chat/read/${activeRoom.roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId })
      }).then(() => {
        // Update local state to clear unread badge
        setConversations(prev => prev.map(c => 
          c.roomId === activeRoom.roomId ? { ...c, unreadCount: 0 } : c
        ));
      });
    }

    const receiveMessageHandler = (data) => {
      if (data.roomId === activeRoom.roomId) {
        setChatHistory(prev => [...prev, data]);
        // Also if we are looking at this room, mark it as read immediately if from buyer
        if (data.senderId !== restaurantId) {
          fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/chat/read/${activeRoom.roomId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ restaurantId })
          });
        }
      } else {
        // Increment unread count for other rooms
        fetchInbox(); // Refresh sidebar
      }
    };

    socketRef.current.off("receive_message"); // clear previous listener
    socketRef.current.on("receive_message", receiveMessageHandler);

  }, [activeRoom, restaurantId]);

  // Auto scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeRoom) return;

    const msgData = {
      roomId: activeRoom.roomId,
      senderId: restaurantId, // Send as the restaurant
      text: message,
      timestamp: new Date()
    };

    socketRef.current.emit("send_message", msgData);
    setMessage("");
    
    // Also update the sidebar preview optimistically
    setConversations(prev => prev.map(c => 
      c.roomId === activeRoom.roomId ? { ...c, lastMessage: message } : c
    ));
  };

  if (loading) return <div className={classes.loading}>Đang tải hộp thư...</div>;
  if (!restaurantId) return <div className={classes.loading}>Bạn chưa có gian hàng nào!</div>;

  return (
    <div className={classes.inboxContainer}>
      <div className={classes.sidebar}>
        <h2 className={classes.sidebarTitle}>Tin nhắn</h2>
        {conversations.length === 0 ? (
          <p className={classes.noConversations}>Chưa có tin nhắn nào.</p>
        ) : (
          <ul className={classes.convList}>
            {conversations.map(conv => (
              <li 
                key={conv.roomId} 
                className={`${classes.convItem} ${activeRoom?.roomId === conv.roomId ? classes.activeItem : ""}`}
                onClick={() => setActiveRoom(conv)}
              >
                <div className={classes.avatar}>{conv.buyerName.charAt(0).toUpperCase()}</div>
                <div className={classes.convInfo}>
                  <div className={classes.convHeader}>
                    <h4>{conv.buyerName}</h4>
                    {conv.unreadCount > 0 && <span className={classes.badge}>{conv.unreadCount}</span>}
                  </div>
                  <p className={`${classes.lastMessage} ${conv.unreadCount > 0 ? classes.bold : ""}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className={classes.chatPane}>
        {activeRoom ? (
          <>
            <div className={classes.chatHeader}>
              <div className={classes.avatar}>{activeRoom.buyerName.charAt(0).toUpperCase()}</div>
              <h3>{activeRoom.buyerName}</h3>
            </div>
            
            <div className={classes.chatBox} ref={chatBoxRef}>
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`${classes.message} ${msg.senderId === restaurantId ? classes.msgSelf : classes.msgOther}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className={classes.inputArea}>
              <input 
                type="text" 
                placeholder="Nhập tin nhắn trả lời..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" disabled={!message.trim()}>➤</button>
            </form>
          </>
        ) : (
          <div className={classes.emptyState}>
            <div className={classes.emptyIcon}>💬</div>
            <p>Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInbox;
