
var fs = require('fs');
//var url = require('url');
var os = require('os');
var path = require('path');
var exec = require('child_process').exec;
var msg_CSDK_HOME_not_correct = 'The CSDK_HOME environment veriable is not set to the correct directory. Please check .....';

//var installerURL = 'http://public.dhe.ibm.com/ibmdl/export/pub/software/data/db2/drivers/odbc_cli/';
var CURRENT_DIR = process.cwd();


//Function to download file using HTTP.get
function IfxNodeJsInstall(file_url)
{
    var readStream;
    var writeStream;
    var platform = os.platform();
    var arch = os.arch();
    var installerfileURL;

    var fstream = require('fstream');
    var unzip = require('unzip');

    var CSDK_HOME = null;
    var iS_CSDK_HOME_Valid = true;

    if (platform == 'win32')
    {

        if (arch == 'x64')
        {
            var BUILD_FILE = path.resolve(CURRENT_DIR, 'bin/Win64_build.zip');
            readStream = fs.createReadStream(BUILD_FILE);
            writeStream = fstream.Writer(CURRENT_DIR);

            readStream
              .pipe(unzip.Parse())
              .pipe(writeStream).on("unpipe", function ()
              {
                  RemoveBuildArchive();
              });
        }
        else
        {
            console.log('Windows 32 bit not supported. Please use an x64 architecture.');
            return;
        }
    }


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
                RemoveBuildArchive();
                buildBinary(false);
            }
            else
            {
                if (iS_CSDK_HOME_Valid == true)
                {
                    console.log('Building binaries for node-ifx_db. This platform is not completely supported, you might encounter errors.');
                    console.log('In such cases please open an issue on our repository, http://github.com/ifx_db/node-ifx_db.');
                    buildBinary(false);
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

    function buildBinary(isDownloaded)
    {
        var buildString = "node-gyp configure build --CSDK_HOME=$CSDK_HOME ";

        if (isDownloaded)
        {
            buildString = buildString + " --IS_DOWNLOADED=true";
        }
        else
        {
            buildString = buildString + " --IS_DOWNLOADED=false";
        }

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


    function RemoveBuildArchive()
    {
        var PathBinDir = path.resolve(CURRENT_DIR, 'bin');
        fs.exists(PathBinDir, function (exists)
        {
            if (exists)
            {
                RmDir(PathBinDir);
            }
        });
    }

    function RmDir(dir)
    {
        var list = fs.readdirSync(dir);

        for (var i = 0; i < list.length; i++)
        {
            var filename = path.join(dir, list[i]);
            var stat = fs.statSync(filename);

            if (filename == "." || filename == "..")
            {
                // pass these files
            }
            else if (stat.isDirectory())
            {
                // RmDir recursively
                RmDir(filename);
            }
            else
            {
                // rm fiilename
                fs.unlinkSync(filename);
            }
        }
        fs.rmdirSync(dir);
    };
	
};

IfxNodeJsInstall();
