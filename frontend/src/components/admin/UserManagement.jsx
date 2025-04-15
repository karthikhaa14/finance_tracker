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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">User Management</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="p-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-2 border rounded" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="p-2 border rounded" required/>
        <select name="role" value={form.role} onChange={handleChange} className="p-2 border rounded">
          <option value="user1">User1</option>
          <option value="user2">User2</option>
        </select>

        <div className="md:col-span-2 grid grid-cols-2 gap-2">
          {Object.keys(form.permissions).map((key) => (
            <label key={key} className="flex items-center space-x-2">
              <input type="checkbox" name={key} checked={form.permissions[key]} onChange={handleChange} />
              <span className="capitalize">{key.replace('_', ' ')}</span>
            </label>
          ))}
        </div>

        <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          create user
        </button>
      </form>

      {/* <table className="min-w-full border text-sm text-left text-gray-800">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{user.username}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border capitalize">{user.role}</td>
              <td className="px-4 py-2 border text-center space-x-2">
                <button onClick={() => handleEdit(user)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default UserManagement;