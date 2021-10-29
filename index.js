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
    id: row.id,
    product: row.product,
    manufacturer: row.manufacturer,
    count: row.count,
    price: row.price,
    is_deleted: row.is_deleted
  };
}

// get product
service.get('/cart/:product', (request, response) => {
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

/*
curl --header 'Content-Type: application/json' \
  --data '{"product": "lamp", "manufacturer": "c-town", "count": 1, "price": 3.50}' \
  https://twenty7.me:8443/cart/
  */

// patch item
service.patch('/cart/:id', (request, response) => {
  const parameters = [
    request.body.product,
    request.body.manufacturer,
    parseInt(request.body.count),
    parseFloat(request.body.price),
    parseInt(request.params.id)
  ];

  const query = 'UPDATE cart SET product = ?, manufacturer = ?, count = ?, price = ? WHERE id = ?';
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

/*
curl --header 'Content-Type: application/json' \
  --request PATCH \
  --data '{"manufacturer": "c-city", "count": 3, "price": 9.50}' \
  https://twenty7.me:8443/cart/ball
*/

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