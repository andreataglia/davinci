const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');

// Mysql connection
const mysql = require('mysql');
const db = makeDb({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'pass',
  database: 'phpmyadmin',
});

// Constants
const PORT = 9000;
const HOST = '127.0.0.1';

// App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/read', async (req, res) => {
  console.log('GET /read');
  try {
    let query = 'SELECT * FROM `vouchers`';
    const rows = await db.query(query);
    res.send(rows);
    return;
  } catch (err) {
    console.log('/read error: ' + err);
    res.sendStatus(500);
    return;
  }
});

// expect body params as {ragione_sociale: 'abcdef', gratuito: true, sconto: 50}
app.post('/write', async (req, res) => {
  console.log('POST /write');
  console.log('Body:', req.body);
  let vouchersCreated = [];
  try {
    // filter data types
    req.body.gratuito = toBool(req.body.gratuito);

    // creat vouchers and insert them into db
    let voucherInserted = false;
    let voucher;
    for (let i = 0; i < req.body.numero_voucher; i++) {
      while (!voucherInserted) {
        voucher = createVoucher(
          req.body.ragione_sociale,
          req.body.gratuito,
          req.body.sconto
        );
        voucherInserted = await insertVoucherIntoDB(voucher);
      }
      vouchersCreated.push(voucher);
      voucherInserted = false;
    }
  } catch (err) {
    console.log('/write error: ' + err);
    res.send(err);
    return;
  }
  res.send({
    vouchers: vouchersCreated,
    ragione_sociale: req.body.ragione_sociale,
    gratuito: req.body.gratuito,
    sconto: req.body.sconto,
  });
});

app.listen(PORT, HOST);
console.log(`Davinci sample project server running at http://${HOST}:${PORT}`);

///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Functions ////////////////////////////////

async function insertVoucherIntoDB(voucher) {
  let query;
  if (voucher.sconto != null) {
    query = `INSERT INTO \`vouchers\` (\`id\`, \`ragione_sociale\`, \`gratuito\`, \`sconto\`, \`timestamp\`) VALUES ('${voucher.id}', '${voucher.ragione_sociale}', '${voucher.gratuito}', '${voucher.sconto}', CURRENT_TIMESTAMP);`;
  } else {
    query = `INSERT INTO \`vouchers\` (\`id\`, \`ragione_sociale\`, \`gratuito\`, \`timestamp\`) VALUES ('${voucher.id}', '${voucher.ragione_sociale}', '${voucher.gratuito}', CURRENT_TIMESTAMP);`;
  }
  try {
    await db.query(query);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

function createVoucher(ragione_sociale, gratuito, sconto) {
  if (gratuito === 1 && sconto != null) {
    throw 'gratuito true while sconto != null';
  } else if (sconto != null && (sconto < 0 || sconto > 100)) {
    throw 'sconto must be between 0 and 100';
  }
  let voucher = {
    id: ragione_sociale.substr(0, 2) + makeid(4),
    ragione_sociale: ragione_sociale,
    gratuito: gratuito,
    sconto: sconto,
  };
  return voucher;
}

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function toBool(value) {
  if (value === 'true' || value == '1') return 1;
  return 0;
}

function makeDb(config) {
  const connection = mysql.createConnection(config);
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
}
