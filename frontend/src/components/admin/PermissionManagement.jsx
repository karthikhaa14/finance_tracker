import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PermissionManagement = () => {
  const [users, setUsers] = useState([]);
  const [permissionsList] = useState([
    'dashboard_access', 'income_access', 'expense_access', 'chatbot_access'
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState({
    dashboard_access: false,
    income_access: false,
    expense_access: false,
    chatbot_access: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      if (res.data) {
        setUsers(res.data); // Ensure we handle cases where the data might be undefined
      } else {
        setUsers([]); // If data is not present, set an empty array
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserChange = async (e) => {
    const userId = e.target.value;
    const user = users.find((user) => user.id === userId);
    setSelectedUser(user);

    if (user) {
      try {
        const permissionsRes = await axios.get(`http://localhost:5000/api/permissions/${userId}`);
        const userPermissions = permissionsRes.data || {}; 
        setPermissions({
          dashboard_access: userPermissions.dashboard_access || false,
          income_access: userPermissions.income_access || false,
          expense_access: userPermissions.expense_access || false,
          chatbot_access: userPermissions.chatbot_access || false,
        });
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    } else {
      setPermissions({
        dashboard_access: false,
        income_access: false,
        expense_access: false,
        chatbot_access: false,
      });
    }
  };

  const handlePermissionChange = (e) => {
    setPermissions({
      ...permissions,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmitPermissions = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("Please select a user.");
      return;
    }

    try {
      // Send updated permissions to backend
      const response = await axios.put(`http://localhost:5000/api/permissions/${selectedUser.id}`, {
        ...permissions,
      });
      if (response.status === 200) {
        alert('Permissions updated successfully!');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Failed to update permissions.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Assign Permissions</h2>

      <div className="mb-4">
        <label htmlFor="user" className="block text-gray-700 font-medium mb-2">
          Select User
        </label>
        <select
          id="user"
          onChange={handleUserChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        >
          <option value="">Select a user</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))
          ) : (
            <option>No users available</option>
          )}
        </select>
      </div>

      {selectedUser && (
        <form onSubmit={handleSubmitPermissions}>
          <h3 className="text-xl font-medium mb-4">Permissions for {selectedUser.username}</h3>
          <div className="space-y-4">
            {permissionsList.map((permission) => (
              <div key={permission} className="flex items-center">
                <input
                  type="checkbox"
                  name={permission}
                  checked={permissions[permission]}
                  onChange={handlePermissionChange}
                  className="mr-2"
                />
                <label htmlFor={permission} className="text-gray-700">
                  {permission.replace('_', ' ').toUpperCase()}
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Update Permissions
          </button>
        </form>
      )}
    </div>
  );
};

export default PermissionManagement;
