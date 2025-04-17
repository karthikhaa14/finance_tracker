import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/common/Welcome';
import Login from './components/common/Login';
import Preloader from './components/common/Preloader.jsx';
import './App.css'
import MainPagePeople from './components/users/Mainpage.jsx';
import Dashboard from './components/users/Dashboard.jsx';
import Income from './components/users/Income.jsx';
import Expense from './components/users/Expense.jsx';
import Chatbot from './components/users/Chatbot.jsx';
import RequestChatbot from './components/users/RequestChatbot.jsx';

import MainpageAdmin from './components/admin/MainpageAdmin.jsx';
import UserManagement from './components/admin/UserManagement.jsx';
import UsersList from './components/admin/UsersList.jsx';
import RequestsComponent from './components/admin/Requestscomponent.jsx';

const App = () => {
  return(
  <Router>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/user' element={<MainPagePeople/>}>
      <Route path='dashboard' element={<Dashboard />} />
          <Route path='income' element={<Income />} />
          <Route path='expense' element={<Expense />} />
          <Route path='chatbot' element={<Chatbot />} />
          <Route path='chatrequest' element={<RequestChatbot />} />
      </Route>
      <Route path='/admin' element={<MainpageAdmin/>}>
          <Route path='user_management' element={<UserManagement />} />
          <Route path='users_list' element={<UsersList />} />
          <Route path='requests' element={<RequestsComponent />} />
      </Route>
    </Routes>
  </Router>)
};

export default App;

