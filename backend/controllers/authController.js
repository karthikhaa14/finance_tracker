const pool = require('../db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
   
      
    try {    
        const { username, password } = req.body;
        const userQuery = await pool.query(
            'SELECT * FROM users WHERE username = $1', 
            [username]
        );
        const user = userQuery.rows[0];

        if (username === process.env.ADMIN_UNAME && password === process.env.ADMIN_PWD) {
            const token = jwt.sign({  role: "admin" },process.env.JWT_SECRET_KEY , { expiresIn: "1h" });
            res.json({ token });
          }
      
        
     
        
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        console.log(user);
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        console.log(user.id)
        res.json({ token:token , user_id:user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = loginUser;