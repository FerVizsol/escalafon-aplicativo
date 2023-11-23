const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const app = express();
const publicDirectoryPath = path.join(__dirname, 'public');
const scriptsDirectoryPath = path.join(__dirname, 'scripts');
app.use(express.json());
app.use(express.static(publicDirectoryPath));
app.use('/scripts', express.static(scriptsDirectoryPath));
//imports
const customerRoutes = require('./routes/customer');
// settings
app.set('port', 3000);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(myConnection(mysql,{
    host: 'localhost',
    user: 'root',
    password: 'clavenueva',
    port: 3306,
    database: 'escalafon'
}, 'single'));
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'clavenueva',
    port: 3306,
    database: 'escalafon',
  });
//routes
app.use('/',customerRoutes);
/*
app.get('/search', (req, res) => {
    const searchTerm = req.query.term;
  
    // Query the database for matching records
    const query = 'SELECT codRuc FROM cliente WHERE codRuc LIKE ?';
    db.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) {
        console.error('Database query error: ' + err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      // Send the matching results as JSON
      res.json(results);
    });
  });
  
// Add a route to fetch item details based on codRuc
app.get('/getItemDetails', (req, res) => {
    const codRuc = req.query.codRuc;
  
    // Query the database for details based on codRuc
    const query = 'SELECT * FROM cliente WHERE codRuc = ?';
    db.query(query, [codRuc], (err, results) => {
      if (err) {
        console.error('Database query error: ' + err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      // Send the details as JSON
      if (results.length > 0) {
        res.json(results[0]); // Assuming you have unique records based on codRuc
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    });
  });

  app.get('/searchProducto', (req, res) => {
    const searchTerm = req.query.term;
  
    // Query the database for matching producto records
    const query = 'SELECT * FROM producto WHERE codProducto LIKE ? OR nombre LIKE ?';
    db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
      if (err) {
        console.error('Database query error: ' + err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      // Send the matching results as JSON
      res.json(results);
    });
  });
  // Add this route to your Express.js application
app.get('/getIgvDecimal', (req, res) => {
  const tipoIgv = req.query.tipoIgv; // Get the tipoIgv value from the query string

  // Perform a database query to fetch igvDecimal based on tipoIgv
  const query = 'SELECT igvDecimal FROM igvTipos WHERE codIgv = ?';

  // Execute the query and return the result as JSON
  db.query(query, [tipoIgv], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      // Handle the case where tipoIgv was not found in the database
      res.status(404).json({ error: 'Tipo IGV not found' });
    } else {
      // Send the igvDecimal value as JSON
      res.json({ igvDecimal: results[0].igvDecimal });
    }
  });
});
// SELECT COUNT(*) FROM table_name;
app.get('/getNumFacturas', (req, res) => {
  // Define the SQL query to count the number of rows in the "factura" table
  const query = 'SELECT COUNT(*) AS contFacturas FROM factura';

  // Execute the query and return the result as JSON
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      // Handle the case where no results were returned (unlikely for a COUNT query)
      res.status(404).json({ error: 'No encontrado' });
    } else {
      // Send the count of invoices as JSON
      res.json({ numFacturas: results[0].contFacturas });
    }
  });
});

app.post('/insertFactura', (req, res) => {
  const { query, values } = req.body;
  console.log(req.body);
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database query error: ' + err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    // If the insertion was successful, send a success response
    res.json({ message: 'Factura inserted successfully', insertId: result.insertId });
  });
}); */

app.get('/getResoluciones/:seccion',(req,res) =>{
  const seccion = req.params.query;
  console.log(seccion);
})

//archivos static
app.use(express.static(path.join(__dirname,'public')));
//run server
app.listen(app.get('port'), () => {
    console.log('Listening on port 3000');
});