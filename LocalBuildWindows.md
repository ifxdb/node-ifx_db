
## Windows Build
----------------
* Build Nodejs from its source 
* Build Informix Nodejs driver 

FYI: make sure bit architecture matches for all binary components  
If you are using 64bit nodejs make sure you are using 64bit Informix Client-SDK as well.  

#### FYI: 
* [Node.js breaking changes between v4 LTS and v6 LTS](https://github.com/nodejs/node/wiki/Breaking-changes-between-v4-LTS-and-v6-LTS)
* [Node.js community wiki](https://github.com/nodejs/node/wiki)


### Prerequisite :
* Informix Client SDK 410 xC2 or above
* Git  
* NodeJS
* Python     (2.7.x (3.x is not supported yet))
* Node-gyp   (npm install -g node-gyp)
* NAN        (npm install -g nan)


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

