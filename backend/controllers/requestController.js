const pool = require('../db'); 

const getRequests= async (req,res)=>{
    try{
        const response= await pool.query(`
            SELECT r.*, u.username ,u.role
            FROM requests r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.request_status = 'pending'
        `)
        // if (response.rows.length === 0) return res.status(404).json({ error: 'Request not found' });
        res.json("response");
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching requests' });
      }
};

const createRequest= async (req,res)=>{
    const {user_id,request_type}= req.body;
    try{
        const query=`INSERT INTO permissions (user_id,request_type,request_status)
                     VALUES ($1, $2,pending) RETURNING *`;
        const values=[user_id,request_type];
        const response=await pool.query(query,values);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating permissions' });
      }
};

const updateRequest = async (req, res) => {
    const { id } = req.params;
    const { request_status } = req.body;
  
    try {
      const query = `UPDATE requests
                     SET request_status=$1
                     WHERE id = $2
                     RETURNING *`;
      const values = [request_status, id];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
    }
  };

module.exports={getRequests,updateRequest,createRequest};
  
