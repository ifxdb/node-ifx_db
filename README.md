node-ifx_db
-----------

An asynchronous/synchronous interface for node.js to IBM Informix.

install
--------

```bash
npm install ifx_db
```

Note: To use ifx_db@1.0.0 on 64bit Windows system, you should install node v0.12.4.  
Prior to the NodeJS driver install please install Informix Client SDK 410xC2 or higher.  
Then set the CSDK_HOME environment variable pointing to Informix Client SDK installation.  
CSDK_HOME=/work/MyCsdk410xC5


Local Build 
-----------
* **Informix Client SDK 410 xC2 or above**
* **nan**
* **Node-gyp**
* **Python 2.7.x  (3.x is not supported yet)**

nan will get installed as part of node-ifx_db  
https://www.python.org/   
npm install -g node-gyp  


Local Build on Windows
----------------------
Set CSDK_HOME environment variable pointing to Informix Client SDK installation.  
CSDK_HOME=C:\MyCsdk410xC5

if you are using the existing Visual Studio 2015 Solution then please set NODE_GYP_HOME as well  
NODE_GYP_HOME environment variable should point to node-gyp install location.  
NODE_GYP_HOME=C:\Users\user1\.node-gyp\0.12.6

Command line build 
------------------
node-gyp configure  
node-gyp build  
node-gyp build --debug  


Connection String
-----------------

```javascript
var dbobj = require('ifx_db');
var ConnectionString = "SERVER=<IDS ServerName>;DATABASE=<dbname>;HOST=<myhost>;PROTOCOL=<Protocol>;SERVICE=<IDS SQLI Port#>;UID=<UserName>;PWD=<password>;";
//Eg: "SERVER=ids1;DATABASE=mydb1;HOST=BlueGene.ibm.com;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;"
```



Example
-------

```javascript

var dbobj = require('ifx_db');

function DirExec( conn, ErrIgn, sql )
{
	try
	{
		var result = conn.querySync( sql );
		console.log( sql  );
	}
    catch (e) 
	{
		console.log( "--- " + sql  );
		if( ErrIgn != 1 )
		{
			console.log(e);
			console.log();
		}
    }
}

function DoSomeWork(err, conn)
{
    if (err) 
	{
        return console.log(err);
    }
	
	DirExec( conn, 1, "drop table t1" );
	DirExec( conn, 0, "create table t1 ( c1 int, c2 char(20) ) " );
	DirExec( conn, 0, "insert into t1 values( 1, 'val-1' )" );
	DirExec( conn, 0, "insert into t1 values( 2, 'val-2' )" );
	DirExec( conn, 0, "insert into t1 values( 3, 'val-3' )" );
	DirExec( conn, 0, "insert into t1 values( 4, 'val-4' )" );
	DirExec( conn, 0, "insert into t1 values( 5, 'val-5' )" );
  
  console.log(" --- SELECT * FROM t1 ------ " );
  // blocks until the query is completed and all data has been acquired
  var rows = conn.querySync( "SELECT * FROM t1" );
  console.log();
  console.log(rows);
};


var MyAsynchronousTask = function (err, conn)
{
	DoSomeWork(err, conn);
	conn.close();
}

function ifx_db_Open(ConStr) 
{
	console.log(" --- MyAsynchronousTask Starting....." );
	dbobj.open( ConStr, MyAsynchronousTask );
	console.log(" --- Check the sequence printed!" );
}

function ifx_db_OpenSync(ConStr) 
{
	console.log(" --- Executing ifx_db.openSync() ...." );
	var conn;
	try 
	{
	  conn = dbobj.openSync(ConStr);
	}
	catch(e) 
	{
	  console.log(e);
	  return;
	}
	
	DoSomeWork(0, conn);
	
	try 
	{
	    conn.closeSync();
	}
	catch(e) 
	{
	  console.log(e);
	}
	console.log(" --- End ifx_db.openSync()" );
}

function main_func()
{
	//  Make sure the port is IDS SQLI port.
	var ConnectionString = "SERVER=ids1;DATABASE=mydb1;HOST=BlueGene.ibm.com;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";
		
	//Synchronous Execution 
	ifx_db_OpenSync(ConnectionString);
	
	//Asynchronous Execution
	ifx_db_Open(ConnectionString);
}

main_func();

```



Discussion Forums
-----------------
To start a discussion or need help you can post a topic on http://stackoverflow.com/questions/tagged/informix

api
---

### Database

The simple api is based on instances of the `Database` class. You may get an 
instance in one of the following ways:

```javascript
require("ifx_db").open(connectionString, function (err, conn){
  //conn is already open now if err is falsy
});
```

or by using the helper function:

```javascript
var ibmdb = require("ifx_db")();
``` 

or by creating an instance with the constructor function:

```javascript
var Database = require("ifx_db").Database
  , ibmdb = new Database();
```

#### .open(connectionString, [options,] callback)

Open a connection to a database.

* **connectionString** - The connection string for your database
* **options** - _OPTIONAL_ - Object type. Can be used to avoid multiple 
    loading of native ODBC library for each call of `.open`.
* **callback** - `callback (err, conn)`

```javascript
var ibmdb = require("ifx_db");

ibmdb.open(connectionString, function (err, connection) {
    if (err) 
    {
      console.log(err);
      return;
    }
    connection.query("select 1 from mytab1", function (err1, rows) 
    {
      if (err1) console.log(err1);
      else console.log(rows);
      connection.close(function(err2) 
      { 
        if(err2) console.log(err2);
      });
    });
};

```

#### .openSync(connectionString)

Synchronously open a connection to a database.

* **connectionString** - The connection string for your database

```javascript
var ibmdb = require("ifx_db"),
	connString = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

try {
	var conn = ibmdb.openSync(connString);
	conn.query("select * from customers fetch first 10 rows only", function (err, rows, moreResultSets) {
		if (err) {
			console.log(err);
		} else {
		  console.log(rows);
		}
		conn.close();	
	});
} catch (e) {
	console.log(e.message);
}
```

#### .query(sqlQuery [, bindingParameters], callback)

Issue an asynchronous SQL query to the database which is currently open.

* **sqlQuery** - The SQL query to be executed.
* **bindingParameters** - _OPTIONAL_ - An array of values that will be bound to
    any '?' characters in `sqlQuery`.
* **callback** - `callback (err, rows, moreResultSets)`

```javascript
var ibmdb = require("ifx_db"),
   cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

ibmdb.open(cn, function (err, conn) {
	if (err) {
		return console.log(err);
	}

	//we now have an open connection to the database
	//so lets get some data
	conn.query("select * from customers fetch first 10 rows only", function (err, rows, moreResultSets) {
		if (err) {
			console.log(err);
		} else {
		
		  console.log(rows);
		}

		//if moreResultSets is truthy, then this callback function will be called
		//again with the next set of rows.
	});
});
```

#### .querySync(sqlQuery [, bindingParameters])

Synchronously issue a SQL query to the database that is currently open.

* **sqlQuery** - The SQL query to be executed.
* **bindingParameters** - _OPTIONAL_ - An array of values that will be bound to
    any '?' characters in `sqlQuery`.

```javascript
var ibmdb = require("ifx_db"),
   cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

ibmdb.open(cn, function(err, conn){

    //blocks until the query is completed and all data has been acquired
    var rows = conn.querySync("select * from customers fetch first 10 rows only");

    console.log(rows);
})
```

#### .close(callback)

Close the currently opened database.

* **callback** - `callback (err)`

```javascript
var ibmdb = require("ifx_db"),
   cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

ibmdb.open(cn, function (err, conn) {
	if (err) {
		return console.log(err);
	}
	
	//we now have an open connection to the database
	
	conn.close(function (err) {
		console.log("the database connection is now closed");
	});
});
```

#### .closeSync()

Synchronously close the currently opened database.

```javascript
var ibmdb = require("ifx_db")(),
   cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

//Blocks until the connection is open
var conn = ibmdb.openSync(cn);

//Blocks until the connection is closed
conn.closeSync();
```

#### .prepare(sql, callback)

Prepare a statement for execution.

* **sql** - SQL string to prepare
* **callback** - `callback (err, stmt)`

Returns a `Statement` object via the callback

```javascript
var ibmdb = require("ifx_db"),
   cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

ibmdb.open(cn,function(err,conn){
  conn.prepare("insert into hits (col1, col2) VALUES (?, ?)", function (err, stmt) {
    if (err) {
      //could not prepare for some reason
      console.log(err);
      return conn.closeSync();
    }

    //Bind and Execute the statment asynchronously
    stmt.execute(['something', 42], function (err, result) {
      if( err ) console.log(err);  
      else result.closeSync();

      //Close the connection
	  conn.close(function(err){}));
    });
  });
});
```

#### .prepareSync(sql)

Synchronously prepare a statement for execution.

* **sql** - SQL string to prepare

Returns a `Statement` object

```javascript
var ibmdb = require("ifx_db"),
   cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

ibmdb.open(cn,function(err,conn){
  var stmt = conn.prepareSync("insert into hits (col1, col2) VALUES (?, ?)");

  //Bind and Execute the statment asynchronously
  stmt.execute(['something', 42], function (err, result) {
    result.closeSync();

    //Close the connection
	conn.close(function(err){}));
  });
});
```

#### .beginTransaction(callback)

Begin a transaction

* **callback** - `callback (err)`

#### .beginTransactionSync()

Synchronously begin a transaction

#### .commitTransaction(callback)

Commit a transaction

* **callback** - `callback (err)`

```javascript
var ibmdb = require("ifx_db"),
   cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

ibmdb.open(cn, function(err,conn) {

  conn.beginTransaction(function (err) {
    if (err) {
      //could not begin a transaction for some reason.
      console.log(err);
      return conn.closeSync();
    }

    var result = conn.querySync("insert into customer (customerCode) values ('stevedave')");

    conn.commitTransaction(function (err) {
      if (err) {
        //error during commit
        console.log(err);
        return conn.closeSync();
      }

    console.log(conn.querySync("select * from customer where customerCode = 'stevedave'"));

     //Close the connection
     conn.closeSync();
    });
  });
});
```

#### .commitTransactionSync()

Synchronously commit a transaction

```javascript
var ibmdb = require("ifx_db"),
   cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

ibmdb.open(cn, function(err,conn) {

  conn.beginTransaction(function (err) {
    if (err) {
      //could not begin a transaction for some reason.
      console.log(err);
      return conn.closeSync();
    }

    var result = conn.querySync("insert into customer (customerCode) values ('stevedave')");

    conn.commitTransactionSync();

    console.log(conn.querySync("select * from customer where customerCode = 'stevedave'"));

     //Close the connection
    conn.closeSync();
  });
});
```

#### .rollbackTransaction(callback)

Rollback a transaction

* **callback** - `callback (err)`

```javascript
var ibmdb = require("ifx_db"),
   cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

ibmdb.open(cn, function(err,conn) {

  conn.beginTransaction(function (err) {
    if (err) {
      //could not begin a transaction for some reason.
      console.log(err);
      return conn.closeSync();
    }

    var result = conn.querySync("insert into customer (customerCode) values ('stevedave')");

    conn.rollbackTransaction(function (err) {
      if (err) {
        //error during rollback
        console.log(err);
        return conn.closeSync();
      }

    console.log(conn.querySync("select * from customer where customerCode = 'stevedave'"));

     //Close the connection
     conn.closeSync();
    });
  });
});
```

#### .rollbackTransactionSync()

Synchronously rollback a transaction

```javascript
var ibmdb = require("ifx_db")
   cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

ibmdb.open(cn, function(err,conn) {

  conn.beginTransaction(function (err) {
    if (err) {
      //could not begin a transaction for some reason.
      console.log(err);
      return conn.closeSync();
    }

    var result = conn.querySync("insert into customer (customerCode) values ('stevedave')");

    conn.rollbackTransactionSync();

    console.log(conn.querySync("select * from customer where customerCode = 'stevedave'"));

     //Close the connection
    conn.closeSync();
  });
});
```

----------

### Pool

node-ifx_db reuses node-odbc pool. 
The node-odbc `Pool` is a rudimentary connection pool which will attempt to have
database connections ready and waiting for you when you call the `open` method.

If you use a `Pool` instance, any connection that you close will cause another
connection to be opened for that same connection string. That connection will
be used the next time you call `Pool.open()` for the same connection string.

This should probably be changed.

#### .open(connectionString, callback)

Get a `Database` instance which is already connected to `connectionString`

* **connectionString** - The connection string for your database
* **callback** - `callback (err, db)`

```javascript
var Pool = require("ifx_db").Pool
	, pool = new Pool()
    , cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

pool.open(cn, function (err, db) {
	if (err) {
		return console.log(err);
	}

	//db is now an open database connection and can be used like normal
	//if we run some queries with db.query(...) and then call db.close();
	//a connection to `cn` will be re-opened silently behind the scense
	//and will be ready the next time we do `pool.open(cn)`
});
```

#### .close(callback)

Close all connections in the `Pool` instance

* **callback** - `callback (err)`

```javascript
var Pool = require("ifx_db").Pool
	, pool = new Pool()
    , cn = "SERVER=ids1;DATABASE=mydb1;HOST=9.25.140.10;PROTOCOL=onsoctcp;SERVICE=5550;UID=user1;PWD=xyz;";

pool.open(cn, function (err, db) {
	if (err) {
		return console.log(err);
	}

	//db is now an open database connection and can be used like normal
	//but all we will do now is close the whole pool
	
	pool.close(function () {
		console.log("all connections in the pool are closed");
	});
});
```
build options
-------------

### Debug

If you would like to enable debugging messages to be displayed you can add the 
flag `DEBUG` to the defines section of the `binding.gyp` file and then execute 
`node-gyp rebuild`.

```javascript
<snip>
'defines' : [
  "DEBUG"
],
<snip>
```
### Unicode

By default, UNICODE suppport is enabled. This should provide the most accurate
way to get Unicode strings submitted to your database. For best results, you 
may want to put your Unicode string into bound parameters. 

However, if you experience issues or you think that submitting UTF8 strings will
work better or faster, you can remove the `UNICODE` define in `binding.gyp`

```javascript
<snip>
'defines' : [
  "UNICODE"
],
<snip>
```




tips
----
### Using node < v0.10 on Linux

Be aware that through node v0.9 the uv_queue_work function, which is used to 
execute the ODBC functions on a separate thread, uses libeio for its thread 
pool. This thread pool by default is limited to 4 threads.

This means that if you have long running queries spread across multiple 
instances of ibmdb.Database() or using odbc.Pool(), you will only be able to 
have 4 concurrent queries.

You can increase the thread pool size by using @developmentseed's [node-eio]
(https://github.com/developmentseed/node-eio).

#### install: 
```bash
npm install eio
```

#### usage:
```javascript
var eio = require('eio'); 
eio.setMinParallel(threadCount);
```

contributors
------
* IBM
* Sathyanesh Krishnan
* Dan VerWeire (dverweire@gmail.com)
* Lee Smith (notwink@gmail.com)
* Bruno Bigras
* Christian Ensel
* Yorick
* Joachim Kainz
* Oleg Efimov
* paulhendrix


license
-------
Copyright (c) 2015 Sathyanesh Krishnan <msatyan@gmail.com>

Copyright (c) 2014 IBM Corporation <opendev@us.ibm.com>

Copyright (c) 2013 Dan VerWeire <dverweire@gmail.com>

Copyright (c) 2010 Lee Smith <notwink@gmail.com>


Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
