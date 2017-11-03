var common = require("./common")
  , odbc = require("../")
  , db = new odbc.Database()
  , assert = require("assert")
  ;

assert.throws(function () {
  db.openSync("this is wrong");
});

assert.equal(db.connected, false);
  
db.open("this is wrong", function(err) {
  console.log(err);
  
  if( /^win/.test(process.platform) )
    assert.deepEqual(err.message, '[Microsoft][ODBC Driver Manager] Invalid connection string attribute');
  else
    assert.deepEqual(err.message, '[Informix][Informix ODBC Driver]General error.');
  
  assert.equal(db.connected, false);
});
