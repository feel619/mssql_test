 const sql = require("mssql");
/*const sqlConfig = {
  user: 'SA',
  password: 'Asdfgh123',
  database: 'TestDB',
  server: 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

 */
const config = {
  user: 'SA',
  password: 'Asdfgh123',
  server: 'localhost',
  database: 'TestDB',
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
    enableArithAbort: true
  }
};
 
(async function() {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const result = await request.query(`
      SELECT * FROM [cdc].[dbo_Persons_CT]

    `);

    /*  const result1 = await request.query(`
      
      SELECT * FROM cdc.fn_cdc_get_net_changes_Persons_cdc        
    `); */

    console.log(result);
    //console.log(result1);
  } catch (err) {
    console.error('An error occurred:', err);
  }
})();

/*
sql.connect(sqlConfig, function (err) {
    if (err) console.log(err);

    const request = new sql.Request()
    request.stream = true // You can set streaming differently for each request
    request.query('select * from [AdventureWorksLT2019].[SalesLT].[Address];') // or request.execute(procedure)

    request.on('recordset', columns => {
        // Emitted once for each recordset in a query
        console.log("recordset")
    })

    request.on('row', row => {
        // Emitted for each row in a recordset
        console.log("row")
    })

    request.on('rowsaffected', rowCount => {
        // Emitted for each `INSERT`, `UPDATE` or `DELETE` statement
        // Requires NOCOUNT to be OFF (default)
        console.log("rowsaffected")
    })

    request.on('error', err => {
        // May be emitted multiple times
        console.log("error")
    })

    request.on('done', result => {
        // Always emitted as the last one
        console.log("done")
    })
});  */