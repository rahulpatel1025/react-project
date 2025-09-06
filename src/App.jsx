import React from 'react';
import SideBar from './components/sidebar/sidebar.jsx';
import Main from './components/main/Main.jsx';
import { AppProvider } from './context/AppContext';
import './App.css';

const App = () => {
  return (
    <AppProvider>
      <div className="app-container">
        <SideBar />
        <Main />
      </div>
    </AppProvider>
  );
};

export default App;

