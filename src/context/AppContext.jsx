import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [newChatSignal, setNewChatSignal] = useState(0);
  const [mainSendMessage, setMainSendMessage] = useState(null);

  const addRecentChat = useCallback((text) => {
    console.log('Adding recent chat:', text);
    setRecentChats(prev => {
      const newChats = [text, ...prev.filter(chat => chat !== text)].slice(0, 5);
      console.log('Updated recent chats:', newChats);
      console.log('Previous state was:', prev);
      return newChats;
    });
  }, []);

  const handleSelectChat = useCallback((text) => {

    setRecentChats(prev => [text, ...prev.filter(chat => chat !== text)].slice(0, 5));
   
    if (mainSendMessage) mainSendMessage(text);
  }, [mainSendMessage]);

  const startNewChat = useCallback(() => {
    setNewChatSignal(prev => prev + 1);
  }, []);

  const setSendMessage = useCallback((fn) => {
    setMainSendMessage(() => fn);
  }, []);

 
  useEffect(() => {
    console.log('AppContext: recentChats state changed to:', recentChats);
  }, [recentChats]);

  
  const value = React.useMemo(() => ({
  
    recentChats,
    newChatSignal,
    mainSendMessage,
    
    addRecentChat,
    handleSelectChat,
    startNewChat,
    setSendMessage,
  }), [recentChats, newChatSignal, mainSendMessage, addRecentChat, handleSelectChat, startNewChat, setSendMessage]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
