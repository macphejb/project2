const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);

const service = express();

connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

function rowToCart(row) {
  return {
    product: row.product,
    manufacturer: row.manufacturer,
    count: row.count
  };
}

// define endpoints...
service.get('/cart/:product', (request, response) => {
  const product = request.params.product;

  const query = 'SELECT * FROM cart WHERE product = ?';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const cart = rows.map(rowToCart);
      response.json({
        ok: true,
        results: rows.map(rowToCart),
      });
    }
  });
});

const port = 8443;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});