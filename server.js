const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 5000;

const startServer = async () => {
  const connection = await mysql.createConnection({
    host: '35.246.95.231',
    user: 'root',
    password: 'q;=I<HCUMe}`9<;P',
    database: 'viebeg_demo'
  });

  app.get('/api/customers', async (req, res) => {
          try {
            const [rows] = await connection.query('SELECT * FROM Customers');
            res.json(rows);
          } catch (error) {
            console.error('Error fetching customer data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        });
        
        app.get('/api/customers/:cust_id/creditScore', async (req, res) => {
          try {
            const custId = req.params.cust_id;
            const [rows] = await connection.query('SELECT * FROM CreditScore WHERE cust_id = ?', [custId]);
        
            if (rows.length === 0) {
              res.status(404).json({ error: 'Credit score not found' });
            } else {
              res.json(rows[0]);
            }
          } catch (error) {
            console.error('Error fetching credit score:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        });
        

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
