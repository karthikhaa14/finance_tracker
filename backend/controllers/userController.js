const pool = require('../db'); // Import the DB configuration
const bcrypt = require('bcryptjs'); 
// Create User
const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // Hash the password before saving to the database
    const password_hash = await bcrypt.hash(password, 10);  // 10 is the salt rounds

    const query = `INSERT INTO users (username, email, password_hash, role)
                   VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [username, email, password_hash, role];
    
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);  // Log error for debugging
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Get User by ID
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    const query = `UPDATE users
                   SET username = $1, email = $2, password_hash = $3, role = $4
                   WHERE id = $5
                   RETURNING *`;
    const values = [username, email, password_hash, role, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

// Get All Users (optional)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
