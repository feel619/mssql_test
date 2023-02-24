const sql = require('mssql');
let xmlParser = require('xml2json');

const config = {
  user: 'SA',
  password: 'Asdfgh123',
  server: 'localhost',
  database: 'TestDB',
  options: {
    //encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
    enableArithAbort: true,
    "encrypt": true,
    "requestTimeout": 0 ,
    "appName": "SQLTools",
        "useUTC": true,
  },
   "previewLimit": 50,
    "port": 1433,
      "driver": "MSSQL",
};
 

async function listenForInsertNotifications() {
  try {
        await sql.connect(config);
        
    //await sql.connect('mssql://sa:Asdfgh123@localhost/TestDB');


    const request = new sql.Request();    
    request.stream = true;   
    // const result = await sql.query`select * from a`
    // console.dir(result)


    //request.query('WAITFOR (RECEIVE TOP (1) message_body   FROM dbo.OrderQueue), TIMEOUT 1000;');
    request.query('WAITFOR(RECEIVE * FROM dbo.OrderQueue), TIMEOUT 1000;');

    request.on('row', row => {
      console.log('New row inserted:', row.message_body.toString());
      console.log('JSON output', xmlParser.toJson(row.message_body));

      const buff = Buffer.from(row.message_body);
      const json = buff.toJSON();
      console.log('json inserted:',json);

    });

     request.on('recordset', columns => {
        // Emitted once for each recordset in a query
        console.log("recordset")
    })

    request.on('rowsaffected', rowCount => {
        // Emitted for each `INSERT`, `UPDATE` or `DELETE` statement
        // Requires NOCOUNT to be OFF (default)
        console.log("rowsaffected")
    })

    request.on('error', err => {
        // May be emitted multiple times
        console.log("error",err)
    })

    request.on('done', result => {
        // Always emitted as the last one
        console.log("done")
    })


  } catch (err) {
    console.error(err);
  }
}

// Example usage
listenForInsertNotifications();

async function listenNotifications() {
  try {

const pool = await sql.connect(config);

const query = `WAITFOR(RECEIVE * FROM dbo.OrderQueue), TIMEOUT 1000;`;
const result = await pool.request().query(query);
console.log(result,"result");
const messageBody = result.recordset[0] ? result.recordset[0].message_body : null;
console.log(messageBody,"messageBody");
  } catch (err) {
    console.error("err",err);
  }
}
listenNotifications() 

/*
DECLARE @messageBody XML;
   SET @messageBody = (
      SELECT * FROM INSERTED FOR XML AUTO, ELEMENTS
   );

   DECLARE @messageTypeName NVARCHAR(256);
   SET @messageTypeName = N'InsertNotificationMessag';

   DECLARE @conversationHandle UNIQUEIDENTIFIER;
   BEGIN DIALOG @conversationHandle
      FROM SERVICE [InsertNotificationServic]
      TO SERVICE '[ReceivingService]'
      ON CONTRACT [InsertNotificationContrac]
      WITH ENCRYPTION = OFF;

   SEND ON CONVERSATION @conversationHandle
      MESSAGE TYPE @messageTypeName
      (@messageBody);

   END CONVERSATION @conversationHandle;


   --     Delete rows from table '[TableName]' in schema '[dbo]'
 --  DELETE FROM Persons WHERE ID = 4

   SELECT name FROM sys.databases WHERE is_cdc_enabled=1

   
 SELECT * FROM cdc.change_tables 
  SELECT * FROM [cdc].[dbo_Persons_CT] ORDER BY __$start_lsn DESC
 
USE TestDB  
GO  
EXEC sys.sp_cdc_disable_table  
@source_schema = N'dbo',  
@source_name   = N'Persons',  
@capture_instance = N'Persons_cdc'  
GO  

EXEC sys.sp_cdc_enable_table  
@source_schema = N'dbo',  
@source_name   = N'Persons',  
@role_name     = NULL,  
@supports_net_changes = 1,
@captured_column_list = N'ID,LastName,FirstName,Age',
@filegroup_name = N'PRIMARY'; 

CREATE MESSAGE TYPE InsertNotificationMessag VALIDATION = NONE;
CREATE CONTRACT InsertNotificationContrac    (InsertNotificationMessag SENT BY INITIATOR);
 CREATE QUEUE InsertNotificationQueu;
ALTER QUEUE InsertNotificationQueu WITH STATUS = ON;

CREATE SERVICE InsertNotificationServic ON QUEUE InsertNotificationQueu (InsertNotificationContrac);

CREATE TRIGGER InsertNotificationTrigger ON dbo.a
AFTER INSERT,update
AS
BEGIN
   DECLARE @messageBody XML;
   SET @messageBody = (
      SELECT * FROM dbo.a FOR XML AUTO, ELEMENTS
   );
    DECLARE @conversationHandle UNIQUEIDENTIFIER;

    SEND ON CONVERSATION @conversationHandle      MESSAGE TYPE InsertNotificationMessag (@messageBody);
    --SEND ON CONVERSATION 'InsertNotificationConversation' MESSAGE TYPE InsertNotificationMessag (@message_body);
END

CREATE TRIGGER  atrigger
ON dbo.a
AFTER INSERT, UPDATE
AS
BEGIN
   DECLARE @messageBody XML;
   SET @messageBody = (
      SELECT * FROM INSERTED FOR XML AUTO, ELEMENTS
   );

   DECLARE @messageTypeName NVARCHAR(256);
   SET @messageTypeName = N'InsertNotificationMessag';

   DECLARE @conversationHandle UNIQUEIDENTIFIER;
   BEGIN DIALOG @conversationHandle
      FROM SERVICE [InsertNotificationServic]
      TO SERVICE '[ReceivingService]'
      ON CONTRACT [InsertNotificationContrac]
      WITH ENCRYPTION = OFF;

   SEND ON CONVERSATION @conversationHandle
      MESSAGE TYPE @messageTypeName
      (@messageBody);

   END CONVERSATION @conversationHandle;
END


 
 INSERT INTO Persons  Values (9, 'Jorge', 'Ramos',15)

 INSERT INTO dbo.Inventory  Values (10, '4',14)

  
INSERT INTO dbo.a  VALUES (NEWID());

 SELECT * FROM [cdc].[Persons_cdc_CT] ORDER BY __$start_lsn DESC
*/