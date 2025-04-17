// React Frontend (Updated UserManagement.jsx)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  //const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user1',
    permissions: {
      dashboard_access: false,
      income_access: false,
      expense_access: false,
      chatbot_access: false,
    }
  });
  //const [editingUserId, setEditingUserId] = useState(null);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:5000/api/users/');
  //     setUsers(res.data);
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in form.permissions) {
      setForm({ ...form, permissions: { ...form.permissions, [name]: checked } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userResponse;
    try {
        userResponse = await axios.post('http://localhost:5000/api/users/', form);
        if(userResponse){
        const user_id = userResponse.data.id;
        await axios.post('http://localhost:5000/api/permissions/', { user_id, ...form.permissions });
      setForm({
        username: '',
        email: '',
        password: '',
        role: 'user1',
        permissions: {
          dashboard_access: false,
          income_access: false,
          expense_access: false,
          chatbot_access: false,
        }
      });}
      else{
        console.log("user not created");
      }
      //fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // const handleEdit = async (user) => {
  //   try {
  //     const permRes = await axios.get(`http://localhost:5000/api/permissions/${user.id}`);
  //     setForm({
  //       username: user.username,
  //       email: user.email,
  //       password: '',
  //       role: user.role,
  //       permissions: permRes.data
  //     });
  //     setEditingUserId(user.id);
  //   } catch (err) {
  //     console.error('Error fetching user permissions:', err);
  //   }
  // };

  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/api/users/${id}`);
  //     await axios.delete(`http://localhost:5000/api/permissions/${id}`);
  //     fetchUsers();
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-10 border border-gray-200">
  <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">User Management</h2>

  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    {/* Username Input */}
    <div>
      <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        placeholder="Enter username"
        value={form.username}
        onChange={handleChange}
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
    </div>

    {/* Email Input */}
    <div>
      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
    </div>

    {/* Password Input */}
    <div>
      <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Enter password"
        value={form.password}
        onChange={handleChange}
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
    </div>

    {/* Role Select */}
    <div>
      <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Role</label>
      <select
        name="role"
        id="role"
        value={form.role}
        onChange={handleChange}
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="user1">User1</option>
        <option value="user2">User2</option>
      </select>
    </div>

    {/* Permissions */}
    <div className="md:col-span-2 grid grid-cols-2 gap-4">
      {Object.keys(form.permissions).map((key) => (
        <label key={key} className="flex items-center space-x-2">
          <input
            type="checkbox"
            name={key}
            checked={form.permissions[key]}
            onChange={handleChange}
            className="form-checkbox text-blue-500"
          />
          <span className="capitalize text-gray-700">{key.replace('_', ' ')}</span>
        </label>
      ))}
    </div>

    {/* Submit Button */}
    <div className="md:col-span-2">
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white text-lg font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create User
      </button>
    </div>
  </form>
</div>

  );
};

export default UserManagement;