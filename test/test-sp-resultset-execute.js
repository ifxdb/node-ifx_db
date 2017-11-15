// Test case to test the OUT parameters and Result set returned by 
// Stored Procedure when Async and Sync forms of Prepare and Execute
// APIs are used.

var common = require("./common")
  , ifxnjs = require("../")
  , assert = require("assert")
  , schema = common.connectionObject.CURRENTSCHEMA;

if(schema == undefined) schema = "NEWTON";

var proc2 = "create procedure " + schema + ".proc2 ( v1 int, INOUT v2 varchar(30)); "+ "let v2='success';"+ "end procedure;"
var proc3 = "create procedure " + schema + ".proc2 ( v1 int, v2 varchar(30)) returning int,varchar(20); "+ "return 1,'bimal' with resume;" + "return 2,'kumar' with resume; end procedure;"
var query = "{call proc2(?, ?)}";

var result;
//ifxnjs.debug(true);
ifxnjs.open(common.connectionString, {fetchMode : 3}, function (err, conn) {
    if(err) { 
      console.log(err);
      process.exit(-1);
    }
    param2 = {ParamType:"INOUT", DataType:1, Data:"abc", Length:50};

	try {
      conn.querySync("drop procedure "+ schema +".proc2;");
    } catch (e) {};
	// Create SP with only OUT param and no resultset.
	conn.querySync(proc2);
	// Call SP Synchronously.
	stmt = conn.prepareSync(query);
	result = stmt.executeSync(['1', param2]);
	console.log("Result for Sync call of PROC2 (1 OUT param and no Result Set) ==>");
	if(Array.isArray(result))
	{
	  // Print INOUT and OUT param values for SP.
	  console.log(result[1]);
	  assert.deepEqual(result[1], ['success']);
	  result = result[0];
	}
	data = result.fetchAllSync();
	if(data.length) console.log(data);
	result.closeSync();
	stmt.closeSync();
	// Call SP Asynchronously.
	conn.prepare(query, function (err, stmt) {
	  if (err) console.log(err);
	  stmt.execute(['1', param2], function(err, result, outparams) {
		if( err ) console.log(err);  
		else {
		  result.closeSync();
		  console.log("Result for Async call of PROC2 (1 OUT param and no Result Set) ==>");
		  console.log(outparams);
		  assert.deepEqual(outparams, ['success']);
		}
		stmt.closeSync();

		try {
			conn.querySync("drop procedure "+ schema +".proc2;");
		} catch (e) {};
		// Create SP with only Result Set and no OUT or INPUT param.
		conn.querySync(proc3);
		// Call SP Synchronously.
		stmt = conn.prepareSync(query);
		result = stmt.executeSync(['1', 'abc']);
		console.log("Result for Sync call of PROC3 (only 2 Result Sets) ==>");
		if(Array.isArray(result))
		{
		  // Print INOUT and OUT param values for SP.
		  console.log(result[1]);
		  assert.deepEqual(result[1], null);
		  result = result[0];
		}
		data = result.fetchAllSync();
		console.log(data);
		assert.equal(data.length, 2);
		while(result.moreResultsSync()) {
		  data = result.fetchAllSync();
		  console.log(data);
		}
		result.closeSync();
		stmt.closeSync();
		// Call SP Asynchronously.
		conn.prepare(query, function (err, stmt) {
		  if (err) console.log(err);
		  stmt.execute(['1', 'abc'], function(err, result, outparams) {
			if( err ) console.log(err);  
			else {
			  data = result.fetchAllSync();
			  console.log("Result for Async call of PROC3 (only 2 Result Sets) ==>");
			  console.log(data);
			  assert.equal(data.length, 2);
			  while(result.moreResultsSync()) {
				data = result.fetchAllSync();
				console.log(data);
			  }
			  result.closeSync();
			}
			stmt.closeSync();

			// Do Cleanup.
			conn.querySync("drop procedure " + schema + ".proc2;");
			// Close connection in last only.
			conn.close(function (err) { console.log("done.");});
		  });
		});
	  });
	});
});

