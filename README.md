
## [Informix native node.js driver](https://openinformix.github.io/IfxNode/)
---------------------------------
Informix native node.js driver is a high performance driver with asynchronous/synchronous interface suitable for highly scalable enterprise applications and lightweight enough for Internet of things (IoT) solutions working with Informix database.

The development activities of the driver are powered by passion, dedication and independent thinking. You may send pull request, together we grow as an open community; relevant discussion and queries are answered by community through **Stack Overflow**. [http://stackoverflow.com/questions/tagged/informix](http://stackoverflow.com/questions/tagged/informix)


## Installing the driver
------------------------
```bash
# Local Install: just for the project.
npm install ifxnjs

# Global Install: on the system for the user
npm install -g ifxnjs
```

The driver has prebuilt binaries for **ARM**, **Linux x64** and **Win64**, and it is certified to work with **Raspberry Pi**; all other platforms you may perform a local build. The current version of Informix native node driver (ifxnjs@10.0.x) is being compiled with Node.js v10.15.1 LTS libraries. The driver is expected to work with all node.js version 10x.  
   
FYI: **[Informix Client SDK](http://www-01.ibm.com/support/docview.wss?uid=swg27016673) 4.10 xC2 or above** is needed for the driver to make connection to the database. Make sure Informix Client SDK is installed and its environments are set prior to running application.  
- [Download Informix Client SDK](http://www-01.ibm.com/support/docview.wss?uid=swg27016673)


### Runtime Environment
-----------------------
The Informix node.js driver has dependency on **Informix Client SDK version 4.10 xC2 or above**. Make sure to set Informix Client SDK runtime environment before running the applications.  

Say **INFORMIXDIR** is the location where you have installed Informix Client SDK.
##### Linux
```bash
export LD_LIBRARY_PATH=${INFORMIXDIR}/lib:${INFORMIXDIR}/lib/esql:${INFORMIXDIR}/lib/cli
```

##### Windows
```bat
SET PATH=%INFORMIXDIR%\bin;%PATH%
```

## Build the driver from its source code
----------------------------------------
The driver has prebuilt native module available for ARM, Linux x64 and Win64, that mean if you are on this platforms in a normal scenario you don’t need to build the driver from its source; just follow the install step mention above and you are good to go. By any chance if you have to build the driver from the source then please follow the step. The driver source code is platform neutral; you may build it on any platforms. If you face any difficulty feel free to reach out to us, we are happy to help you. The following URL has instruction to build it on ARM, Linux and Windows. 

* [Linux Build](./LocalBuildLinux.md)
* [Windows Build](./LocalBuildWindows.md)


## Connection
-------------
```javascript
var dbobj = require('ifxnjs');
var ConStr = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;";

var conn = dbobj.openSync(ConStr);

// FYI: for Asynchronous open then
// dbobj.open( ConStr, (err, conn) => {} );

// -- -- -- -- -- -- --
// Do some DB work here
// -- -- -- -- -- -- --

conn.closeSync();
```



## Example
-------

```javascript

var dbobj = require('ifxnjs');

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

function ifxnjs_Open(ConStr) 
{
  console.log(" --- MyAsynchronousTask Starting....." );
  dbobj.open( ConStr, MyAsynchronousTask );
  console.log(" --- Check the sequence printed!" );
}

function ifxnjs_OpenSync(ConStr) 
{
  console.log(" --- Executing ifxnjs.openSync() ...." );
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
  console.log(" --- End ifxnjs.openSync()" );
}

function main_func()
{
  //  Make sure the port is IDS SQLI port.
  var ConnectionString = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;";
    
  //Synchronous Execution 
  ifxnjs_OpenSync(ConnectionString);
  
  //Asynchronous Execution
  ifxnjs_Open(ConnectionString);
}

main_func();

```

API
---

### Database

The simple api is based on instances of the `Database` class. You may get an 
instance in one of the following ways:

```javascript
require("ifxnjs").open(connectionString, function (err, conn){
  //conn is already open now if err is falsy
});
```

or by using the helper function:

```javascript
var dbobj = require("ifxnjs")();
``` 

or by creating an instance with the constructor function:

```javascript
var Database = require("ifxnjs").Database
  , dbobj = new Database();
```

#### .open(connectionString, [options,] callback)

Open a connection to a database.

* **connectionString** - The connection string for your database
* **options** - _OPTIONAL_ - Object type. Can be used to avoid multiple 
    loading of native ODBC library for each call of `.open`.
* **callback** - `callback (err, conn)`

```javascript
var dbobj = require("ifxnjs");

dbobj.open(connectionString, function (err, connection) {
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
var dbobj = require("ifxnjs"),
  connString = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

try {
  var conn = dbobj.openSync(connString);
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
var dbobj = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

dbobj.open(cn, function (err, conn) {
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
var dbobj = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

dbobj.open(cn, function(err, conn){

    //blocks until the query is completed and all data has been acquired
    var rows = conn.querySync("select * from customers fetch first 10 rows only");

    console.log(rows);
})
```

#### .close(callback)

Close the currently opened database.

* **callback** - `callback (err)`

```javascript
var dbobj = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

dbobj.open(cn, function (err, conn) {
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
var dbobj = require("ifxnjs")(),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

//Blocks until the connection is open
var conn = dbobj.openSync(cn);

//Blocks until the connection is closed
conn.closeSync();
```

#### .prepare(sql, callback)

Prepare a statement for execution.

* **sql** - SQL string to prepare
* **callback** - `callback (err, stmt)`

Returns a `Statement` object via the callback

```javascript
var dbobj = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

dbobj.open(cn,function(err,conn){
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
var dbobj = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

dbobj.open(cn,function(err,conn){
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
var dbobj = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

dbobj.open(cn, function(err,conn) {

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
var dbobj = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

dbobj.open(cn, function(err,conn) {

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
var dbobj = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

dbobj.open(cn, function(err,conn) {

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
var dbobj = require("ifxnjs")
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

dbobj.open(cn, function(err,conn) {

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

### Connection Pool
Work in progress...... 


contributors
------------
* Javier Sagrera
* Sathyanesh Krishnan (msatyan@gmail.com)



license
-------
Copyright (c) 2017 Sathyanesh Krishnan <msatyan@gmail.com>

Copyright (c) 2017 Javier Sagrera

Copyright (c) 2013 Dan VerWeire <dverweire@gmail.com>

Copyright (c) 2010 Lee Smith <notwink@gmail.com>

