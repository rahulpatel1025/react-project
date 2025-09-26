import React from 'react';
import SideBar from './components/SideBar/SideBar.jsx';
import Main from './components/main/Main.jsx';
import { AppProvider } from './context/AppContext';
import { GeminiProvider } from './context/GeminiContext';
import './App.css';

const App = () => {
  return (
    <AppProvider>
      <GeminiProvider>
        <div className="app-container">
          <SideBar />
          <Main />
        </div>
      </GeminiProvider>
    </AppProvider>
  );
};

export default App;

