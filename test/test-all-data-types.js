var common = require("./common")
    , ifxnjs = require("../")
    , assert = require("assert")
    , cn = common.connectionString;

    ifxnjs.open(cn, function(err, conn) {
      if(err) console.log(err);
      assert.equal(err, null);

      try {
        conn.querySync("drop table mytab1");
      } catch (e) {}
      conn.querySync("create table mytab1 (c1 int, c2 SMALLINT, c3 BIGINT, c4 INTEGER, c5 DECIMAL(3), c6 DOUBLE PRECISION, c7 float, c8 decimal, c9 decimal(10,3), c10 char(10), c11 varchar(10), c12 boolean, c13 text, c14 date, c15 datetime hour to second, c16 interval year to month);");
      conn.querySync("insert into mytab1 values (1, 2, 456736789, 1234, 67.98, 5689, 56.2390, 34567890, 45.234, 'bimal', 'kumar', 't', 'TEXT', '01/01/2017', '10:16:33', '09-10');");
      conn.query("select * from mytab1", function(err, data) {
          if(err) console.log(err);
          else {
            console.log(data);
          }
          conn.querySync("drop table mytab1");
          conn.closeSync();

          assert.deepEqual(data,
[ { c1: 1,
    c2: 2,
    c3: '456736789',
    c4: 1234,
    c5: '68.0',
    c6: '5689',
    c7: 56.239,
    c8: '34567890.0',
    c9: '45.234',
    c10: 'bimal     ',
    c11: 'kumar',
    c12: true,
    c13: 'TEXT',
    c14: '2017-01-01',
    c15: '10:16:33',
    c16: '    9-10'} ]);

      });
    });
