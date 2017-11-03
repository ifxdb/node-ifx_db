var common = require("./common")
  , odbc = require("../")
  , db = new odbc.Database()
  , assert = require("assert")
  ;

db.open(common.connectionString, function(err) {
  assert.equal(err, null);
  assert.equal(db.connected, true);
  
  var dt = new Date();
  var dtString = dt.toISOString().replace('Z','').replace('T', ' ') + '00';
  var sql = "SELECT cast('" + dtString + "' as DATETIME YEAR TO FRACTION(5)) as DT1 FROM TABLE(SET{1})";
  
  console.log(sql);
  
  db.query(sql, function (err, data) {
    assert.equal(err, null);
    assert.equal(data.length, 1);

    db.close(function () {
      assert.equal(db.connected, false);
      console.log(dt);
      console.log(data);
      
      //test selected data after the connection
      //is closed, in case the assertion fails
	  assert.equal(data[0].dt1.constructor.name, "String", "DT1 is not an instance of a String object");
      //assert.equal(data[0].dt1.getTime(), dt.getTime());
    });
  });
});
