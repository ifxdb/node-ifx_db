var common = require("./common")
    , ifxnjs = require("../")
    , assert = require("assert")
    , fs = require('fs')
    , cn = common.connectionString
    , inputfile1 = 'data/phool.jpg'
    , inputfile2 = 'data/desc.txt'
    , outputfile1 = 'phool2.jpg'
    , outputfile2 = 'desc2.txt'
    ;

ifxnjs.open(cn, function (err,conn) 
{
  if (err) 
  {
    console.log(err);
  }
  assert.equal(err, null);
  try {
      conn.querySync("drop table mytab");
  } catch (e) {};
  try {
    conn.querySync("create table mytab (empId int, photo BLOB, desc CLOB)");
    } catch (e) {};
  
  var img1= fs.readFileSync(inputfile1,'binary');
  var text= fs.readFileSync(inputfile2,'ascii');

  var len1 = img1.length;
  var len2 = text.length;
  console.log( "img1.length = " + len1);
  console.log( "text.length = " + len2);

  conn.prepare("insert into mytab(empId, photo, desc) VALUES (?, ?, ?)", 
      function (err, stmt) 
   {
    if (err) 
    {
      console.log(err);
      return conn.closeSync();
    }
   
    var photo = {DataType: "BLOB", "Data":img1};
    var desc = {DataType: "CLOB", Data: text};

    stmt.execute([18, photo, desc], function (err, result) 
    {
      if( err ) console.log(err);  
      else result.closeSync();
      
      conn.prepare("select * from mytab", function (err, stmt)
      {
        if(err) 
        {
          console.log(err);
          return conn.closeSync();
        }

        stmt.execute([], function(err, result) {
          if(err) console.log(err);
          else 
          {
            data = result.fetchAllSync();
            fs.writeFileSync(outputfile1, data[0].photo, 'binary');
            fs.writeFileSync(outputfile2, data[0].desc, 'ascii');
            result.closeSync();
            try {
             //   conn.querySync("drop table mytab");
            } catch (e) {};
           
  
            var size1 = fs.statSync(outputfile1)["size"];
            var size2 = fs.statSync(outputfile2)["size"];
			console.log("Lengths before  = " + len1+ ", " + len2);
            console.log("Lengths  after  = " + size1+ ", " + size2);
            assert(len1, size1);
            assert(len2, size2);

          //  fs.unlinkSync(outputfile1);
          //  fs.unlink(outputfile2, function () { console.log('done'); });
          }
        });
      });
    });
  });
});


