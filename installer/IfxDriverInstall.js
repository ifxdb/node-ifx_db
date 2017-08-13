
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

function IfxNodeJsInstall(file_url)
{
    var CSDK_HOME = null;
    var iS_CSDK_HOME_Valid = true;

    // Check prebuilt binaries available, if so install it with that
    var PreBuiltFound = UnZipPreBuilts();
    if (PreBuiltFound == true )
    {
        return(true);
    }

    //Pre-built binaries are not available for this platform. 
    if (PreBuiltFound == false )
    {
        console.log('No prebuilt binaries available for platform=' + 
                                platform + 'with architecture='+ arch);
        console.log('You may try local build steps to build the driver on this platform')
        //return(false);
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
                buildBinary();
            }
            else
            {
                if (iS_CSDK_HOME_Valid == true)
                {
                    console.log('Building binaries for node-ifx_db. This platform is not completely supported, you might encounter errors.');
                    console.log('In such cases please open an issue on our repository, http://github.com/ifx_db/node-ifx_db.');
                    buildBinary();
                }
                else
                {
                    if (UnZipPreBuilts() == false)
                    {
                        console.log('Please install Informix Client SDK prior to installing Informix NodeJS.');
                        console.log('Please set CSDK_HOME environment variable pointing to Client SDK installation.');
                        process.exit(1);
                    }
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

    function UnZipPreBuilts()
    {
        var PlatformDir = undefined;

        if (platform == 'win32')
        {
            if (arch == 'x64')
            {
                PlatformDir = 'Win64';
            }
        }
        // if (platform == 'linux' )
        // {
        //     if (arch == 'x64')
        //     {
        //         PlatformDir = 'Linux64';
        //     }
        //     if (arch == 'arm64')
        //     {
        //         PlatformDir = 'Arm64';
        //     }           
        // }        

        if( PlatformDir == undefined)
        {
            return (false);
        }

        var fstream = require('fstream');
        var unzip = require('unzip');

        // var BUILD_FILE = path.resolve(CURRENT_DIR, 'bin/' + build_file);
        var BUILD_FILE = path.resolve(CURRENT_DIR, 
            'prebuilt/' + PlatformDir + '/' + 'build.zip');
        
        var readStream = fs.createReadStream(BUILD_FILE);
        var writeStream = fstream.Writer(CURRENT_DIR);

        readStream
          .pipe(unzip.Parse())
          .pipe(writeStream).on("unpipe", function ()
          {
              RemoveBuildArchive();
          });

        return (true);
    }

    function RemoveBuildArchive()
    {
        // Set to false if we decided to remomve pre-built
        var DoNotRemoveBuildArchive = true;
        if( DoNotRemoveBuildArchive == true)
        {
            // Let us not remove build archive
            return;
        }

        var PathBinDir = path.resolve(CURRENT_DIR, 'prebuilt');
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
