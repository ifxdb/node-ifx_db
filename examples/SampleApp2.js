

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


function DoSomePrepareExec(conn)
{
    var stmt;

    console.log("--- CreateStatementSync");
    try
    {
        stmt = conn.createStatementSync();
    }
    catch (e)
    {
        console.log(e);
        return;
    }
    console.log("--- CreateStatementSync Done");
    stmt.closeSync();


/*
    conn.createStatement(function (err, stmt)
    {
        var r, result, caughtError;

        //try excuting without preparing or binding.
        try
        {
            result = stmt.executeSync();
        }
        catch (e)
        {
            caughtError = e;
        }

        try
        {
            assert.ok(caughtError);
        }
        catch (e)
        {
            console.log(e.message);
            exitCode = 1;
        }

        //try incorrectly binding a string and then executeSync
        try
        {
            r = stmt.bind("select 1 + 1 as col1");
        }
        catch (e)
        {
            caughtError = e;
        }

        try
        {
            assert.equal(caughtError.message, "Argument 1 must be an Array");

            r = stmt.prepareSync("select 1 + ? as col1 from SYSIBM.SYSDUMMY1");
            assert.equal(r, true, "prepareSync did not return true");

            r = stmt.bindSync([2]);
            assert.equal(r, true, "bindSync did not return true");

            result = stmt.executeSync();
            assert.equal(result.constructor.name, "ODBCResult");

            r = result.fetchAllSync();
            assert.deepEqual(r, [{ COL1: 3 }]);

            r = result.closeSync();
            assert.equal(r, true, "closeSync did not return true");

            result = stmt.executeSync();
            assert.equal(result.constructor.name, "ODBCResult");

            r = result.fetchAllSync();
            assert.deepEqual(r, [{ COL1: 3 }]);

            console.log(r);
        }
        catch (e)
        {
            console.log(e);

            exitCode = 1;
        }

        //conn.closeSync();

        if (exitCode)
        {
            console.log("failed");
        }
        else
        {
            console.log("success");
        }

        process.exit(exitCode);
    });
    */
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
	DirExec(conn, 0, "insert into t1 values( 5, 'val-5' )");

	console.log(" --- prepareSync() ------ ");
	DoSomePrepareExec(conn)

/*
	//var stmt = conn.prepareSync("insert into t1 (c1, c2) VALUES (?, ?)");
    //Bind and Execute the statment asynchronously
	stmt.execute([ 6, 'BindVal-6'], 
        function (err, result) 
	{
	    result.closeSync();

	});
*/

    console.log();
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
	console.log();
	console.log(" --- MyAsynchronousTask Starting....." );
	dbobj.open( ConStr, MyAsynchronousTask );
	//dbobj.close(function () {});
	console.log(" --- Log Message sequence... ?" );
	console.log(" --- You are on Asynchronous call! :)" );
}

function ifxnjs_OpenSync(ConStr) 
{
	console.log();
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
	    //dbobj.closeSync();
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
    ////  Make sure the port is IDS SQLI port.
	var ConnectionString = "SERVER=ids0;DATABASE=db1;HOST=127.0.0.1;SERVICE=9088;PROTOCOL=onsoctcp;UID=informix;PWD=xxxx;";

	//Synchronous Execution 
	ifxnjs_OpenSync(ConnectionString);
	
	//Asynchronous Execution
	//ifxnjs_Open(ConnectionString);
}

main_func();



