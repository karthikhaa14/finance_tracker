const pool = require('../db'); // Import the DB configuration

// Create Permissions (for chatbot access)
const createPermissions = async (req, res) => {
  const { user_id,dashboard_access,income_access,expense_access, chatbot_access } = req.body;
  try {
    const query = `INSERT INTO permissions (user_id, dashboard_access,income_access,expense_access,chatbot_access)
                   VALUES ($1,$2,$3,$4, $5) RETURNING *`;
    const values = [user_id,dashboard_access,income_access,expense_access, chatbot_access];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating permissions' });
  }
};

const getPermissions = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT dashboard_access, income_access, expense_access, chatbot_access FROM permissions WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) { return res.status(404).json({ error: 'Permissions not found' });}
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching permissions' });
  }
};

const updatePermissions = async (req, res) => {
  const { user_id } = req.params;
  const { chatbot_access } = req.body;
  try {
    const query = `UPDATE permissions
                   SET chatbot_access = $1
                   WHERE user_id = $2
                   RETURNING *`;
    const values = [chatbot_access, user_id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Permissions not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating permissions' });
  }
};

// Delete Permissions (for chatbot access)
const deletePermissions = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('DELETE FROM permissions WHERE user_id = $1 RETURNING *', [user_id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Permissions not found' });
    res.status(204).json({ message: 'Permissions deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting permissions' });
  }
};

module.exports = {
  createPermissions,
  getPermissions,
  updatePermissions,
  deletePermissions,
};
