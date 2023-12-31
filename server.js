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



 app.get('/api/province-occurrences', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT location_province FROM Customers');

    // Filter out null values and extract province names
    const provinces = rows.map((row) => row.location_province).filter(Boolean);

    // Create an object to store province occurrences
    const provinceOccurrences = {};

    // Count the number of customers under each province
    provinces.forEach((province) => {
      provinceOccurrences[province] = (provinceOccurrences[province] || 0) + 1;
    });

    res.json(provinceOccurrences);
  } catch (error) {
    console.error('Error fetching province data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




  app.get('/api/province-occurrences', async (req, res) => {
    try {
      const [rows] = await connection.query('SELECT DISTINCT location_province FROM Customers');
  
      // Normalize province names by converting to lowercase and trimming spaces
      const provinces = rows.map((row) => row.location_province);
  
      // Create an object to store province occurrences
      const provinceOccurrences = {};
  
      provinces.forEach((province) => {
        if (province) {
          provinceOccurrences[province] = (provinceOccurrences[province] || 0) + 1;
        }
      });
  
      res.json(provinceOccurrences);
    } catch (error) {
      console.error('Error fetching province data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  // app.get('/api/districts', async (req, res) => {
  //   try {
  //     const [rows] = await connection.query('SELECT location_district FROM Customers');
  //     const districts = rows.map((row) => row.location_district);
  
  //     // Create an object to store district occurrences
  //     const districtOccurrences = {};
  
  //     districts.forEach((district) => {
  //       districtOccurrences[district] = (districtOccurrences[district] || 0) + 1;
  //     });
  
  //     res.json(districtOccurrences);
  //   } catch (error) {
  //     console.error('Error fetching district data:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  

  
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
      // Update the location_province values to remove leading and trailing spaces
      await connection.query('UPDATE Customers SET location_province = TRIM(location_province)');
  
      // Fetch the distinct province names after the update
      const [rows] = await connection.query('SELECT DISTINCT location_province FROM Customers');
      const provinces = rows.map((row) => row.location_province);
  
      res.json(provinces);
    } catch (error) {
      console.error('Error fetching province data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  
//   app.get('/api/province-names', async (req, res) => {
//     try {
//         const [rows] = await connection.query('SELECT DISTINCT location_province FROM Customers');

//         // Normalize province names by trimming spaces
//         const provinces = rows.map((row) => (row.location_province ? row.location_province.trim() : null));

//         // Filter out null values
//         const uniqueProvincesSet = new Set(provinces);
//         const uniqueProvinces = Array.from(uniqueProvincesSet);

//         console.log('Province names:', uniqueProvinces);
//         res.json(uniqueProvinces);
//     } catch (error) {
//         console.error('Error fetching province data:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });



app.get('/api/province-names', async (req, res) => {
  try {
    // Update the location_province values to remove leading and trailing spaces
    await connection.query('UPDATE Customers SET location_province = TRIM(location_province)');

    // Fetch the distinct province names after the update
    const [rows] = await connection.query('SELECT DISTINCT location_province FROM Customers');
    const provinces = rows.map((row) => row.location_province);

    res.json(provinces);
  } catch (error) {
    console.error('Error fetching province data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  // app.get('/api/province-names', async (req, res) => {
  //   try {
  //     const [rows] = await connection.query('SELECT DISTINCT location_province FROM Customers');
  //     const provinces = rows.map((row) => row.location_province.trim()); // Trim leading/trailing spaces
  //     res.json(provinces);
  //   } catch (error) {
  //     console.error('Error fetching province data:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  


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


  app.get('/api/sectors', async (req, res) => {
    try {
      const [rows] = await connection.query('SELECT DISTINCT Sector FROM facilitiesfemi');
      const sectors = rows.map((row) => row.Sector);
      res.json(sectors);
    } catch (error) {
      console.error('Error fetching sector data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.get('/api/facility-types', async (req, res) => {
    try {
      const [rows] = await connection.query('SELECT DISTINCT `FACILITY TYPE` FROM facilitiesfemi');
      const facilityTypes = rows.map((row) => row['FACILITY TYPE']);
      res.json(facilityTypes);
    } catch (error) {
      console.error('Error fetching facility types:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  app.get('/api/diseases', async (req, res) => {
    try {
      const [rows] = await connection.query('SELECT DISTINCT DISEASES FROM facilitiesfemi');
      const diseases = rows.map((row) => row.DISEASES);
      res.json(diseases);
    } catch (error) {
      console.error('Error fetching disease data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

 app.get('/api/equipments', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT DISTINCT EQUIPMENT FROM facilitiesfemi');
    const equipments = rows.map((row) => row.EQUIPMENT);
    res.json(equipments);
  } catch (error) {
    console.error('Error fetching equipment data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();