// Test case to verify result of OUT and INOUT Parameters in a Strored Procedure.

var common = require("./common")
  , ifxnjs = require("../")
  , assert = require("assert")
  , cn = common.connectionString
  , schema = common.connectionObject.CURRENTSCHEMA;

if(schema == undefined) schema = "NEWTON";
var query = "{call proc1(?, ?, ?)}";
ifxnjs.open(cn, function (err, conn)
{
    if(err) console.log(err);
    assert.equal(err, null);
    try {
          conn.querySync("drop procedure " + schema + ".proc1");
    } catch(e) {}

    conn.querySync("create procedure " + schema + ".proc1 " +
                   "(v1 INTEGER, OUT v2 INTEGER, INOUT v3 VARCHAR(20)) " +
                   "let v2 = v1 + 1; let v3 = 'verygood'; end procedure");
    var param1 = {ParamType:"INPUT", DataType:1, Data:0};
    var param2 = {ParamType:"OUTPUT", DataType:1, Data:0};
    var param3 = {ParamType:"INOUT", DataType:1, Data:"abc", Length:30};

    result = conn.querySync(query, [param1, param2, param3]);
    assert.deepEqual(result, [ 1, 'verygood' ]);
    console.log("Output Parameters V2 = ", result[0], ", V3 = ", result[1]);

    conn.querySync("drop procedure " + schema + ".proc1(int, int, varchar(20))");
    conn.querySync("create procedure " + schema + ".proc1 (v1 integer); end procedure");
    result = conn.querySync("call proc1(?)", [param1]);
    assert.deepEqual(result, []);
    conn.querySync("drop procedure " + schema + ".proc1(INT)");
    conn.closeSync();
    console.log('done');
});
