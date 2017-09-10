
var fs = require('fs');
//var url = require('url');
var os = require('os');
var platform = os.platform();
var arch = os.arch();

var path = require('path');
var exec = require('child_process').exec;
var msg_CSDK_HOME_not_correct = 'The CSDK_HOME environment veriable is not set to the correct directory. Please check .....';

//var installerURL = 'http://public.dhe.ibm.com/ibmdl/export/pub/software/data/db2/drivers/odbc_cli/';
var CURRENT_DIR = process.cwd();

function IfxNodeJsBuild()
{
    var CSDK_HOME = null;
    var iS_CSDK_HOME_Valid = true;

    if (process.env.CSDK_HOME || process.env.INFORMIXDIR )
    {
        if (process.env.CSDK_HOME)
        {
            CSDK_HOME = process.env.CSDK_HOME;
            console.log('Using CSDK_HOME environment variable set to ' + CSDK_HOME);
        }
        else
        {
            CSDK_HOME = process.env.INFORMIXDIR;
            console.log('Trying to derive CSDK_HOME from INFORMIXDIR set to' + CSDK_HOME);
        }

        var CSDK_INCLUDE = path.resolve(CSDK_HOME, 'incl/cli');
        var CSDK_LIB = path.resolve(CSDK_HOME, 'lib');

        if (!fs.existsSync(CSDK_HOME))
        {
            console.log(msg_CSDK_HOME_not_correct);
            iS_CSDK_HOME_Valid = false;
        }

        if (!fs.existsSync(CSDK_INCLUDE))
        {
            console.log(msg_CSDK_HOME_not_correct);
            iS_CSDK_HOME_Valid = false;
        }

        if (!fs.existsSync(CSDK_LIB))
        {
            console.log(msg_CSDK_HOME_not_correct);
            iS_CSDK_HOME_Valid = false;
        }

        if (platform != 'win32')
        {
            if (platform == 'linux' || (platform == 'darwin' && arch == 'x64'))
            {
                buildBinary();
            }
            else
            {
                if (iS_CSDK_HOME_Valid == true)
                {
                    console.log('Building binaries for IfxNode. This platform is not completely supported, you might encounter errors.');
                    console.log('In such cases please open an issue on our repository, https://github.com/OpenInformix/IfxNode');
                    buildBinary();
                }
                else
                {
                        console.log('Please install Informix Client SDK prior to installing Informix NodeJS.');
                        console.log('Please set CSDK_HOME environment variable pointing to Client SDK installation.');
                        process.exit(1);
                }
            }
        }
    }
    else
    {
        console.log('Error: Please set CSDK_HOME environment variable');
        iS_CSDK_HOME_Valid = false;
        process.exit(1);
    }

    function buildBinary()
    {
        var buildString = "node-gyp configure build";

        var childProcess = exec(buildString, function (error, stdout, stderr)
        {
            console.log(stdout);
            if (error !== null)
            {
                console.log(error);
                process.exit(1);
            }
        });
    }

};

IfxNodeJsBuild();
