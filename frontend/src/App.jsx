import React, { useState, useEffect } from 'react';
import Welcome from './components/common/Welcome';
import Login from './components/common/Login';
import Preloader from './components/common/Preloader.jsx';
import './App.css'

const App = () => {
  const [appState, setAppState] = useState('preloader');

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setAppState('welcome');
    }, 2000);

    const loginTimer = setTimeout(() => {
      setAppState('login');
    }, 10000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(loginTimer);
    };
  }, []);
  
  switch(appState) {
    case 'preloader':
      return <Preloader />;
    case 'welcome':
      return <Welcome />;
    case 'login':
      return <Login />;
    default:
      return <Preloader />;
  }
};

export default App;

