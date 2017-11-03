var odbc = require("../");

// netstat -a | findstr  9088
// exports.ConnectionString = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxxx;";
exports.connectionString = "";

try {
  exports.connectionObject = require('./config.testConnectionStrings.json');
}
catch (e) {
  exports.connectionObject = {
    SERVER : "ids1210",
    DATABASE : "sample",
    HOSTNAME : "localhost",
    UID : "informix",
    PWD : "xxxxxx",
    SERVICE : "9088",
    PROTOCOL : "onsoctcp"
  };
}

exports.connectionObject.SERVER	  = process.env.IFX_SERVER   || exports.connectionObject.SERVER;
exports.connectionObject.DATABASE = process.env.IFX_DBNAME   || exports.connectionObject.DATABASE;
exports.connectionObject.HOSTNAME = process.env.IFX_HOSTNAME || exports.connectionObject.HOSTNAME;
exports.connectionObject.UID      = process.env.IFX_UID      || exports.connectionObject.UID;
exports.connectionObject.PWD      = process.env.IFX_PWD      || exports.connectionObject.PWD;
exports.connectionObject.SERVICE  = process.env.IFX_SERVICE  || exports.connectionObject.SERVICE;
exports.connectionObject.PROTOCOL = process.env.IFX_PROTOCOL || exports.connectionObject.PROTOCOL;

//checks if schema is defined
if (process.env.IFX_SCHEMA !== 'undefined') {
    exports.connectionObject.CURRENTSCHEMA = process.env.IFX_SCHEMA || exports.connectionObject.CURRENTSCHEMA;
}

for(key in exports.connectionObject) 
{
    if(exports.connectionObject[key] != undefined)
      exports.connectionString = exports.connectionString + key + "=" +
                                 exports.connectionObject[key] + ";" ;
}

//if (process.argv.length === 3) {
//  exports.connectionString = process.argv[2];
//}

exports.testConnectionStrings = [{ title : "Informix", 
                        connectionString : exports.connectionString }];
exports.benchConnectionStrings = exports.testConnectionStrings;

if (process.argv.length === 3) {
  //look through the testConnectionStrings to see if there is a title that matches
  //what was requested.
  var lookup = process.argv[2];
  
  exports.testConnectionStrings.forEach(function (connectionString) {
    if (connectionString && connectionString.title && connectionString.title == lookup) {
      exports.connectionString = connectionString.connectionString
    }
  });
}

exports.databaseName = exports.connectionObject.DATABASE;
exports.tableName = "NODE_ODBC_TEST_TABLE";

exports.dropTables = function (db, cb) {
  db.query("drop table " + exports.tableName, cb);
};

exports.createTables = function (db, cb) {
  db.query("create table " + exports.tableName + " (COLINT INTEGER, COLDATETIME DATETIME YEAR TO FRACTION(5), COLTEXT VARCHAR(255))", cb);
};
