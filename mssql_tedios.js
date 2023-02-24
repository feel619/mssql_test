/*const { Connection, Request } = require('tedious');
 
const config = {
  server: 'localhost',
  authentication: {
    type: 'default',
    options: {
      userName: 'SA',
      password: 'Asdfgh123'
    }
  },
  options: {
    database: 'TestDB',
    encrypt: true,
     trustServerCertificate: true, // change to true for local dev / self-signed certs
    enableArithAbort: true,
  }
};  

const connection = new Connection(config);

connection.on('connect', err => {
  if (err) {
    console.error("err",err.message);
  } else {
    console.log('Connected to database');
  }
});


const messageHandler = () => {
  const request = new Request('WAITFOR(RECEIVE * FROM dbo.OrderQueue)', err => {
    if (err) {
      console.error(err.message);
    }
  });

  request.on('row', columns => {
    // Handle the received message here
    console.log('Received message:', columns[0].value);
  });

  connection.execSql(request);
};

messageHandler();*/
const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/*
const {Connection, Request} = require("tedious");
const executeSQL = (sql, callback) => {
  let connection = new Connection({
    "authentication": {
      "options": {
        "userName": "SA",
        "password": "Asdfgh123"
      },
      "type": "default"
    },
    "server": "localhost",
    "options": {
      "validateBulkLoadParameters": false,
      "rowCollectionOnRequestCompletion": true,
      "database": "TestDB",
        trustServerCertificate: true, // change to true for local dev / self-signed certs
    enableArithAbort: true,
      "encrypt": true
    }
  });
  connection.connect((err) => {
    if (err)
      return callback(err, null);
    const request = new Request(sql, (err, rowCount, rows) => {
      connection.close();
      if (err)
        return callback(err, null);
      callback(null, {rowCount, rows});
    });
    connection.execSql(request);
  });
};
executeSQL("WAITFOR(RECEIVE TOP (1) message_body FROM dbo.OrderQueue)", (err, data) => {
  if (err)
    console.error(err);
  console.log(data.rows);
});*/


app.listen(port, () => {
  console.log(`Node start app listening on port ${port}`)
})


const Sqlssb = require('sqlssb')
const service1 = new Sqlssb({
  user: 'sa',
  password: 'Asdfgh123',
  server: 'localhost',
  database: 'TestDB',
  service: 'OrderService',
  queue: 'OrderQueue'
})
 
service1.on('ReceivedOrders', ctx => {

  console.log("REC1",ctx.conversationId);
  console.log("REC2",ctx.messageBody);
  console.log("REC3",ctx.messageTypeName);
  console.log("REC4",ctx.messageSequenceNumber);
  console.log("REC5",ctx.serviceName);
})
 
service1.start({ //default settings:
  timeout: 5000, //5 seconds
  count: 1 //one message at a time
})

 
/*
https://www.sqlshack.com/using-the-sql-server-service-broker-for-asynchronous-processing/

https://github.com/tinkerscript/sqlssb
https://www.npmjs.com/package/sqlssb

*/