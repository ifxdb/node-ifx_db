// Test case to verify result of OUT and INOUT Parameters in a Strored Procedure.
// When SP is called using conn.query() assynchronously.

var common = require("./common")
  , ifxnjs = require("../")
  , assert = require("assert")
  , cn = common.connectionString
  , schema = common.connectionObject.CURRENTSCHEMA;

if(schema == undefined) schema = "NEWTON";
ifxnjs.open(cn, function (err, conn)
{
    var query = "{CALL proc1(?, ?, ?)}";
    if(err) console.log(err);
    assert.equal(err, null);

    try {
          conn.querySync("drop procedure " + schema + ".proc1(INT, INT, VARCHAR(20))");
    } catch(e) {}
    
    conn.querySync("create procedure " + schema + ".proc1 " +
                   "(v1 INTEGER, OUT v2 INTEGER, INOUT v3 VARCHAR(20)); " +
                   "let v2 = v1 + 1; let v3 = 'verygood'; end procedure");
    console.log("created proc1...\n");
    conn.commitTransactionSync();
    var param1 = {ParamType:"INPUT", DataType:"INTEGER", Data:3};
    var param2 = {ParamType:"OUTPUT", DataType:"INTEGER", Data:0};
    var param3 = {ParamType:"INOUT", DataType:"CHAR", Data:"abc", Length:30};

    conn.query(query, [param1, param2, param3], function(err, result){
        if(err) console.log(err);
        else {
            console.log("return value = ", result);
        }
        conn.querySync("drop procedure " + schema + ".proc1(INT, INT, VARCHAR(20))");
        assert.deepEqual(result[1], 'verygood' );
    });

    try {
        conn.querySync("drop procedure " + schema + ".proc2;");
    } catch(e) {}

    conn.querySync("create procedure " + schema + ".proc2 (v1 INTEGER); end procedure");
    var param1 = {ParamType:"INPUT", DataType:"INTEGER", Data:3};
    query = "call " + schema + ".proc2(?)";
    conn.query({"sql":query, "params" : [param1]}, function(err, result){
        if(err) console.log(err);
        conn.querySync("drop procedure " + schema + ".proc2(INT)");
        conn.closeSync();
        assert.equal(result.length, 0);
        console.log('done');
    });
});
