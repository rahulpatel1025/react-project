import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import '../../css/sidebar.css';

const SideBar = () => {
  const { recentChats, handleSelectChat, startNewChat } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className='top'>
        <img
          className='menu'
          src={assets.menu_icon}
          alt='Sidebar Logo'
          onClick={() => setCollapsed(!collapsed)}
        />

        {/* New Chat button */}
        <div className='new-chat' onClick={startNewChat}>
          <img src={assets.plus_icon} alt='plus icon' />
          <p>New Chat</p>
        </div>

        {/* Recent chats */}
        <div className='recent'>
          <p className='recent-title'>Recent Chat</p>
          {recentChats.length === 0 && <p className='no-recent'>No recent chats</p>}
          {recentChats.map((chat, idx) => (
            <div
              key={idx}
              className='recent-entry'
              onClick={() => handleSelectChat(chat)}
            >
              <img src={assets.message_icon} alt='message icon' />
              <p>{chat.length > 30 ? chat.slice(0, 30) + '...' : chat}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='bottom'>
        <div className='bottom-item recent-entry'>
          <img src={assets.question_icon} alt='question-icon' />
          <p>Help</p>
        </div>
        <div className='bottom-item recent-entry'>
          <img src={assets.history_icon} alt='history-icon' />
          <p>Recents</p>
        </div>
        <div className='bottom-item recent-entry'>
          <img src={assets.setting_icon} alt='setting-icon' />
          <p>Settings</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
