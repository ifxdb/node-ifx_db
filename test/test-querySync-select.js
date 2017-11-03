var common = require("./common")
  , odbc = require("../")
  , db = new odbc.Database()
  , assert = require("assert")
  ;

db.openSync(common.connectionString);
assert.equal(db.connected, true);

var data = db.querySync("select 1 as COLINT, 'some test' as COLTEXT from table(set{1})");
assert.deepEqual(data, [{ colint: 1, coltext: 'some test' }]);

db.fetchMode = 3; // Fetch in array mode.
data = db.querySync("select 1, 2, 3 from table(set{1});");
console.log(data);
assert.deepEqual(data, [ [ 1, 2, 3 ] ]);

db.fetchMode = 4; // Fetch in object mode. It is default mode too.
data = db.querySync("select first 3 tabid, tabname from systables;");
console.log(data[2]);
assert.deepEqual(data[2], { 'tabid': 3, 'tabname': 'sysindices' });
db.closeSync();


