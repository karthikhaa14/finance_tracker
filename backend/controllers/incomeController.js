const pool = require('../db'); // Import the DB configuration

// Create Income
const createIncome = async (req, res) => {
  const { user_id, source, amount, date } = req.body;
  try {
    const query = `INSERT INTO incomes (user_id, source, amount, date)
                   VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [user_id, source, amount, date];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating income' });
  }
};

// Get Income by ID
const getIncome = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM incomes WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Income not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching income' });
  }
};

// Update Income
const updateIncome = async (req, res) => {
  const { id } = req.params;
  const { source, amount, date } = req.body;
  try {
    const query = `UPDATE incomes
                   SET source = $1, amount = $2, date = $3
                   WHERE id = $4
                   RETURNING *`;
    const values = [source, amount, date, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Income not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating income' });
  }
};

// Delete Income
const deleteIncome = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM incomes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Income not found' });
    res.status(204).json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting income' });
  }
};

// Get all Incomes by User ID
const getIncomesByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM incomes WHERE user_id = $1', [user_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching incomes' });
  }
};

module.exports = {
  createIncome,
  getIncome,
  updateIncome,
  deleteIncome,
  getIncomesByUser,
};
