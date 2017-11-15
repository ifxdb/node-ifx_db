var common = require("./common")
  , ifxnjs = require("../")
  , assert = require("assert")
  , schema = common.connectionObject.CURRENTSCHEMA;

if(schema == undefined) schema = "NEWTON";
var proc2 = "create procedure " + schema + ".proc2 ( v1 int, INOUT v2 varchar(30)); "+ "let v2='success';"+ "end procedure;"
var proc3 = "create procedure " + schema + ".proc2 ( v1 int, v2 varchar(30)) returning int,varchar(20); "+ "return 1,'bimal' with resume;" + "return 2,'kumar' with resume; end procedure;"

var query = "{call proc2(?, ?)}";
var result;
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
	result = conn.querySync(query, ['1', param2]);
	console.log("Result for Sync call of proc2 ==>");
	console.log(result);
	assert.equal(result.length, 1);
	// Call SP Asynchronously.
	conn.query(query, ['1', param2], function (err, result) {
		if (err) console.log(err);
		else {
		  console.log("Result for Async call of proc2 ==>");
		  console.log(result);
		  assert.equal(result.length, 2);
		}

		try {
			conn.querySync("drop procedure "+ schema +".proc2;");
		} catch (e) {};
		// Create SP with only Result Set and no OUT or INPUT param.
		conn.querySync(proc3);
		// Call SP Synchronously.
		result = conn.querySync(query, [1, 'abc']);
		console.log("Result for Sync call of proc3 ==>");
		console.log(result);
		assert.equal(result.length, 2);
		// Call SP Asynchronously.
		conn.query(query, ['1', 'abc'], function (err, result) {
			if (err) console.log(err);
			else {
			  console.log("Result for Async call of proc3 ==>");
			  console.log(result);
			  assert.equal(result.length, 2);
			}

			// Do Cleanup.
			conn.querySync("drop procedure " + schema + ".proc2");
			// Close connection in last only.
			conn.close(function (err) { console.log("done.");});
		});
	});
});