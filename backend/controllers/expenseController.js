const pool = require('../db'); // Import the DB configuration

// Create Expense
const createExpense = async (req, res) => {
  const { user_id, category, description, amount, date } = req.body;
  try {
    const query = `INSERT INTO expenses (user_id, category, amount, date)
                   VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [user_id, category, description, amount, date];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating expense' });
  }
};

// Get Expense by ID
const getExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Expense not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expense' });
  }
};

// Update Expense
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { category, description, amount, date } = req.body;
  try {
    const query = `UPDATE expenses
                   SET category = $1, description = $2, amount = $3, date = $4
                   WHERE id = $5
                   RETURNING *`;
    const values = [category, description, amount, date, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Expense not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating expense' });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Expense not found' });
    res.status(204).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting expense' });
  }
};

// Get all Expenses by User ID
const getExpensesByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [user_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
};

module.exports = {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpensesByUser,
};
