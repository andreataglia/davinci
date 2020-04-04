const express = require('express');
const bodyParser = require('body-parser');

// Mysql connection
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'pass',
  database: 'phpmyadmin'
});
db.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

// TODO delete. just trying out
let query = 'SELECT * FROM `vouchers` ORDER BY id ASC';
db.query(query, (err, result) => {
console.log(result);
});

// Constants
const PORT = 8080;
const HOST = '127.0.0.1';

// App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/read', (req, res, next) => {
  console.log('GET /read');
  let vouchers;
  try {
    // TODO read the data
  } catch (err) {
    console.log('/read error: ' + err);
    res.sendStatus(500);
  }
  res.send(vouchers);
});

// expect body params as {ragione_sociale: 'abcdef', gratuito: true, sconto: 50}
app.post('/write', async (req, res) => {
  console.log('POST /write');
  console.log('Body:', req.body);
  let vouchers;
  try {
    // TODO create the vouchers
  } catch (err) {
    console.log('/write error: ' + err);
    res.sendStatus(500);
  }
  res.send(vouchers);
});

app.listen(PORT, HOST);
console.log(`Davinci sample project server running at http://${HOST}:${PORT}`);
