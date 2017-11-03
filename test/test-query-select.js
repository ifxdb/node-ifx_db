var common = require("./common")
  , odbc = require("../")
  , db = new odbc.Database()
  , assert = require("assert")
  ;

db.openSync(common.connectionString);

db.query("select 1 as COLINT, 'some test' as COLTEXT FROM TABLE(SET{1})", function (err, data) {
  db.closeSync();
  assert.equal(err, null);
  assert.deepEqual(data, [{ colint: '1', coltext: 'some test' }]);
});

