/*require the ibm_db module*/
var common = require("./common")
  , ifxnjs = require("../")
  , assert = require("assert")
  , db = new ifxnjs.Database();

var connString = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxxx;";

console.log("Test program to access Informix sample database");

/*Connect to the database server
  param 1: The DSN string which has the details of database name to connect to, user id, password, hostname, portnumber 
  param 2: The Callback function to execute when connection attempt to the specified database is completed
*/
ifxnjs.open(common.connectionString, function(err, conn)
{
        if(err) {
          	console.error("error: ", err.message);
            assert.equal(err.message, null);
        } else {

		console.log('Connection to Informix machine successful');

		/*
			On successful connection issue the SQL query by calling the query() function on Database
			param 1: The SQL query to be issued
			param 2: The callback function to execute when the database server responds
		*/
		conn.query("SELECT TIMESTAMP_FORMAT('1999-12-31 23:59:59.123', 'YYYY-MM-DD HH24:MI:SS.FF') AS TD FROM TABLE(SET{1});", function(err, nodetest, moreResultSets) {
		
			if(err) {
				console.log('Error: '+err);
				process.exit(0);
			}
			console.log('Fetched Row Count: '+nodetest.length);
			console.log("TIME");
			console.log("-----------------------");

			for (var i=0;i<nodetest.length;i++)
			{
				console.log(nodetest[i].TD);
			}
			console.log("-----------------------");

			/*
				Close the connection to the database
				param 1: The callback function to execute on completion of close function.
			*/
			conn.close(function(){
				console.log("Connection Closed");
			});
		});
	}
});
