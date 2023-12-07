const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const startServer = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });



  app.use(cors()); // Enable CORS for all routes

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

  app.get('/api/customers/:cust_id/transactions', async (req, res) => {
    try {
      const custId = req.params.cust_id;
      const [rows] = await connection.query('SELECT * FROM Transactions WHERE cust_id = ?', [custId]);
  
      if (rows.length === 0) {
        res.status(404).json({ error: 'No transactions found for this customer' });
      } else {
        res.json(rows);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.get('/api/districts', async (req, res) => {
    try {
      const [rows] = await connection.query('SELECT location_district FROM Customers');
      const districts = rows.map((row) => row.location_district);
  
      // Create an object to store district occurrences
      const districtOccurrences = {};
  
      districts.forEach((district) => {
        districtOccurrences[district] = (districtOccurrences[district] || 0) + 1;
      });
  
      res.json(districtOccurrences);
    } catch (error) {
      console.error('Error fetching district data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.get('/api/districts-names', async (req, res) => {
    try {
      const [rows] = await connection.query('SELECT DISTINCT location_district FROM Customers');
      const districts = rows.map((row) => row.location_district);
      res.json(districts);
    } catch (error) {
      console.error('Error fetching district data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  app.get('/api/province-names', async (req, res) => {
    try {
      const [rows] = await connection.query('SELECT DISTINCT location_province FROM Customers');
      const provinces = rows.map((row) => row.location_province);
      res.json(provinces);
    } catch (error) {
      console.error('Error fetching province data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/sector-names', async (req, res) => {
    try {
      const [rows] = await connection.query('SELECT DISTINCT location_sector FROM Customers');
      const sectors = rows.map((row) => row.location_sector);
      res.json(sectors);
    } catch (error) {
      console.error('Error fetching sector data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();