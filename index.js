const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);

const service = express();
service.use(express.json());

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
    count: row.count,
    price: row.price
  };
}

// get product
service.get('/item/:product', (request, response) => {
  const parameters = [
    request.params.product
  ];

  const query = 'SELECT * FROM cart WHERE product = ? AND is_deleted = 0';
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

// create item
service.post('/cart', (request, response) => {
  if (request.body.hasOwnProperty('product') &&
    request.body.hasOwnProperty('manufacturer') &&
    request.body.hasOwnProperty('count') &&
    request.body.hasOwnProperty('price')) {

    const parameters = [
      request.body.product,
      request.body.manufacturer,
      parseInt(request.body.count),
      parseFloat(request.body.price)
    ];

    const query = 'INSERT INTO cart(product, manufacturer, count, price) VALUES (?, ?, ?, ?)';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
          //results: 'It worked!',
          results: result.insertId,
        });
      }
    });
  }
});

// patch item
service.patch('/cart/:product', (request, response) => {
  const parameters = [
    request.body.product,
    request.body.manufacturer,
    parseInt(request.body.count),
    parseFloat(request.body.price),
    parseInt(out_of_stock)
  ];

  const query = 'UPDATE cart SET manufacturer = ?, count = ?, price = ?, out_of_stock = ? WHERE product = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

// delete item
service.delete('/cart/:product', (request, response) => {
  const parameters = [request.params.product];
  //const product = request.params.product;

  const query = 'UPDATE cart SET is_deleted = 1 WHERE product = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

// get report
service.get('/report.html', (request, response) => {
    response.sendFile('report.html', {root: __dirname});
});

const port = 5001;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});