##### Copyright 2017 OpenInformix

##### [Licensed under the MIT](https://opensource.org/licenses/MIT)

## Informix native node.js driver
---------------------------------
Informix native node.js driver is a high performance driver with asynchronous/synchronous interface suitable for highly scalable enterprise and IoT solutions working with Informix database.  

The development activities of the driver are powered by passion, dedication and independent thinking. You may send pull request, together we grow as an open community; relevant discussion and queries are answered by community through stackoverflow. [http://stackoverflow.com/questions/tagged/informix](http://stackoverflow.com/questions/tagged/informix)


## install
----------
```bash
npm install ifxnjs
```

The driver has been certified to work with **Raspberry Pi**, it has prebuilt binaries for **ARM**, **x86 Linux64** and **Win64**, all other platform you may perform a local build. The current version of Informix native node driver (ifxnjs@6.0.x) is being compiled with Node.js v6.11.x LTS libraries. The driver is expected to work node.js version 6x.  
   
**FYI**: Informix Client SDK 410 xC2 or above is needed the driver to connect to the database. Make sure Informix CSDK is configured and its environments are set prior to running application.


## Linux Build
--------------
**FYI:** Make sure bit architectures matches for all binary components; if you are using 64bit nodejs make sure you are using 64bit Informix Client-SDK as well.

### Prerequisite :
* Git  
* NodeJS
* Python     (2.7.x (3.x is not supported yet))
* Node-gyp   (npm install -g node-gyp)
* NAN        (npm install -g nan)
* Informix Client SDK 410 xC2 or above


```bash  
# Assuming that you have installed 'node.js' at /work/nodejs
# Assuming that you have installed 'CSDK' at /work/informix

# Then the complile time environment setting  
export CSDK_HOME=/work/informix  
export PATH=/work/nodejs/bin:$PATH  

# Runtime environment setting  
export INFORMIXDIR=${CSDK_HOME}  
export LD_LIBRARY_PATH=${INFORMIXDIR}/lib/esql:${INFORMIXDIR}/lib/cli  
```

### Fire the build 
```bash 
cd /work/t1
git clone https://github.com/OpenInformix/IfxNode.git

cd /work/t1/IfxNode
npm update

rm -rf ./build  
node-gyp configure -v  
node-gyp build -v 
```

#### check the build output, if all right then the driver binary is    
```bash
ls -l ./build/Release/ifx_njs_bind.node
```

#### Build Cleanup
```bsh
rm /work/t1/IfxNode/build/binding.Makefile
rm /work/t1/IfxNode/build/config.gypi
rm /work/t1/IfxNode/build/ifx_njs_bind.target.mk
rm /work/t1/IfxNode/build/Makefile
rm -rf /work/t1/IfxNode/build/Release/obj.target
rm -rf /work/t1/IfxNode/build/Release/.deps
```

### Quick test of the local build

##### Set runtime environment to pick Informix Client SDK libraries.
```bash
export LD_LIBRARY_PATH=${INFORMIXDIR}/lib:${INFORMIXDIR}/lib/esql:${INFORMIXDIR}/lib/cli
export PATH=$INFORMIXDIR/bin:$PATH
```

##### Get a sample code 
```bash
cd /work/try

#rm -rf node_modules
mkdir  /work/try/node_modules

cd /work/try/node_modules
ln -s  /work/t1/IfxNode  ./ifxnjs
cd ..
cp /work/t1/IfxNode/test/SampleApp1.js .
```
##### Run the sample 
```bash
# edit connection informaton and then run
node SampleApp1.js
```


## Windows Build
----------------
* Build Nodejs from its source 
* Build Informix Nodejs driver 

FYI: make sure bit architecture matches for all binary components  
If you are using 64bit nodejs make sure you are using 64bit Informix Client-SDK as well.  


### Prerequisite :
* Git  
* NodeJS
* Python     (2.7.x (3.x is not supported yet))
* Node-gyp   (npm install -g node-gyp)
* NAN        (npm install -g nan)
* Informix Client SDK 410 xC2 or above


#### Build node.js from its source
The **node.lib** is needed for compiling C/C++ native addons, One of the ways to get this library is to build node.js from its source, then there will never be any compatibility issue.  
FYI: The node.lib can also be obtained from **node-gyp** too, it is up to you to choose one of the approach.  


#### Open VS 2015 x64 cmd
```bat
# Say you have extracted NodeJS sourct at **C:\njs\Src6112**
cd C:\njs\Src6112

SET NODE_SRC=C:\njs\Src6112
vcbuild.bat nosign release x64

FYI:
vcbuild.bat nosign release x64 : Build in release mode in 64-bit computers
vcbuild.bat nosign debug x64   : Build in debug mode for 64-bit computers
vcbuild.bat nosign release     : Build in release mode in 32-bit computers
vcbuild.bat clean              : Clean Project
```


### Build the Informix node.js driver 

#### clone the driver source code
```bat
cd C:\work
git clone https://github.com/OpenInformix/IfxNode.git
cd C:\work\IfxNode
```

#### Set env for the build 
* **c:\Informix** is the location where Informix CSDK installed 
* **C:\njs\Src6112** is the nodejs source that you have completed the build 
``` bat
#Open VS 2015 x64 cmd

#Switch NodeJS to picket from the newly build location
SET PATH=C:\njs\Src6112\Debug;C:\njs\Src6112\deps\npm\bin\node-gyp-bin;%PATH%
or (depens on your nodejs build)
SET PATH=C:\njs\Src6112\Release;C:\njs\Src6112\deps\npm\bin\node-gyp-bin;%PATH%

SET CSDK_HOME=c:\Informix
SET NODE_SRC=C:\njs\Src6112
```

#### Fire the driver build 
```bat
cd C:\work\IfxNode
npm install nan

node-gyp configure
node-gyp build

#FYI: 
node-gyp build  --debug
node-gyp build  --release

Alternative build: you may use the Visual Studio 2015 Solution to build from source
C:\work\IfxNode\IfxNodeJsVS2015.sln
```

### Driver binaries
```bash
#If no build error then the driver binaries will be at 
C:\work\IfxNode\build\Debug
# or
C:\work\IfxNode\build\Release
```
### Cleanup build files
```bat
del C:\work\IfxNode\build\binding.sln
del C:\work\IfxNode\build\config.gypi
del C:\work\IfxNode\build\ifx_njs_bind.vcxproj
del C:\work\IfxNode\build\ifx_njs_bind.vcxproj.filters

del C:\work\IfxNode\build\Release\ifx_njs_bind.exp
del C:\work\IfxNode\build\Release\ifx_njs_bind.lib
del C:\work\IfxNode\build\Release\ifx_njs_bind.map
del C:\work\IfxNode\build\Release\ifx_njs_bind.pdb

del /S /F /Q C:\work\IfxNode\build\Release\obj
rd /S /Q C:\work\IfxNode\build\Release\obj
```

### Quick test of the local build 
```bash
md C:\work\t1
cd C:\work\t1
npm install bindings
# FYI: Copy the entire IfxNode dir under C:\work\t1\node_modules\ and then rename it to ifxnjs
xcopy C:\work\IfxNode C:\work\t1\node_modules\ifxnjs /s /I

copy C:\work\IfxNode\examples\SampleApp1.js

#edit the connection information of the application, then run
node SampleApp1.js
```

#### [FYI: node-gyp build helps](https://github.com/nodejs/node-gyp)
| **Command**   | **Description**
|:--------------|:---------------------------------------------------------------
| `help`        | Shows the help dialog
| `build`       | Invokes `make`/`msbuild.exe` and builds the native addon
| `clean`       | Removes the `build` directory if it exists
| `configure`   | Generates project build files for the current platform
| `rebuild`     | Runs `clean`, `configure` and `build` all in a row
| `install`     | Installs node header files for the given version
| `list`        | Lists the currently installed node header versions
| `remove`      | Removes the node header files for the given version

  
  
## Runtime Environment Setup
----------------------------------

### Set runtime environment to pick Informix Client SDK libraries.
#### Linux
```bash
export LD_LIBRARY_PATH=${INFORMIXDIR}/lib:${INFORMIXDIR}/lib/esql:${INFORMIXDIR}/lib/cli
export PATH=$INFORMIXDIR/bin:$PATH
```

#### Windows
```bat
# say you have installed CSDK at C:\informix then
SET PATH=C:\informix\bin;%PATH%
```

#### FYI: 
* [Node.js breaking changes between v4 LTS and v6 LTS](https://github.com/nodejs/node/wiki/Breaking-changes-between-v4-LTS-and-v6-LTS)
* [Node.js community wiki](https://github.com/nodejs/node/wiki)


## Connection String
--------------------

```javascript
var dbobj = require('ifxnjs');
var ConStr = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;";
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
  var ConnectionString = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"
    
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
var ibmdb = require("ifxnjs")();
``` 

or by creating an instance with the constructor function:

```javascript
var Database = require("ifxnjs").Database
  , ibmdb = new Database();
```

#### .open(connectionString, [options,] callback)

Open a connection to a database.

* **connectionString** - The connection string for your database
* **options** - _OPTIONAL_ - Object type. Can be used to avoid multiple 
    loading of native ODBC library for each call of `.open`.
* **callback** - `callback (err, conn)`

```javascript
var ibmdb = require("ifxnjs");

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
var ibmdb = require("ifxnjs"),
  connString = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var ibmdb = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var ibmdb = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var ibmdb = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var ibmdb = require("ifxnjs")(),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var ibmdb = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var ibmdb = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var ibmdb = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var ibmdb = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var ibmdb = require("ifxnjs"),
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var ibmdb = require("ifxnjs")
   cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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

Rudimentary support, rework in progress...... 


#### .open(connectionString, callback)

Get a `Database` instance which is already connected to `connectionString`

* **connectionString** - The connection string for your database
* **callback** - `callback (err, db)`

```javascript
var Pool = require("ifxnjs").Pool
  , pool = new Pool()
    , cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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
var Pool = require("ifxnjs").Pool
  , pool = new Pool()
    , cn = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;UID=informix;PWD=xxxx;"

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

