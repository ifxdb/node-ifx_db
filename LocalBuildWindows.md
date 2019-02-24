
## Windows Build
----------------
- Build Nodejs from its source
- Build Informix Nodejs driver

FYI: make sure bit architecture matches for all binary components  
If you are using 64bit nodejs make sure you are using 64bit Informix Client-SDK as well.  

#### FYI:
- [Node.js community wiki](https://github.com/nodejs/node/wiki)
- [The latest node source code](https://github.com/nodejs/node)

### Prerequisite :
* Informix Client SDK 410 xC2 or above
* git
* node.js
* python     (2.7.x (3.x is not supported yet))
* node-gyp
* nan


#### Build node.js from its source
The **node.lib** is needed for compiling C/C++ native addons, One of the ways to get this library is to build node.js from its source, then there will never be any compatibility issue.  
FYI: The node.lib can also be obtained from **node-gyp** too, it is up to you to choose one of the approach.  


#### Open VS 2017 x64 cmd
The node.js v10 is being build by using VS 2017
```bash
# Say you have extracted NodeJS sourct at **C:\work\node-v10.15.1**
cd C:\work\node-v10.15.1

SET NODE_SRC=C:\work\node-v10.15.1
vcbuild.bat nosign release x64
# or if build without OpenSSL assembler modules
vcbuild.bat nosign openssl-no-asm release x64

FYI:
vcbuild.bat nosign release x64 : Build in release mode in 64-bit computers
vcbuild.bat nosign debug x64   : Build in debug mode for 64-bit computers
vcbuild.bat nosign release     : Build in release mode in 32-bit computers
vcbuild.bat clean              : Clean Project

# if no build errors then
# check whether "node.lib" has built
dir node.lib /s /b
```

---
### Build the Informix node.js driver
The build has dependency on
- nan
- node-gyp
- node.lib

#### clone the driver source code and install build dependency
```bash
cd C:\work
git clone https://github.com/OpenInformix/IfxNode.git
cd C:\work\IfxNode

# install build dependency modules
npm install nan
npm install node-gyp
```

#### Set environment and fire the driver build
Open VS 2017 x64 command window
```bash
# Let us say
# Informix Client SDK installed location is   C:\Informix
# The nodejs source (with build) is at        C:\work\node-v10.15.1
# The informix driver source code is at       C:\work\IfxNode

# Switch "node.js" and "node-gyp" to picket from the newly build location
# (if you are using debug build then use Debug)
# SET PATH=C:\work\node-v10.15.1\Debug;C:\work\node-v10.15.1\deps\npm\bin\node-gyp-bin;%PATH%

SET PATH=C:\work\node-v10.15.1\Release;C:\work\node-v10.15.1\deps\npm\bin\node-gyp-bin;%PATH%
SET CSDK_HOME=c:\Informix
SET NODE_SRC=C:\work\node-v10.15.1

#### Fire the driver build ####
cd C:\work\IfxNode
node-gyp configure
node-gyp build  --release
# or for debug build then
node-gyp build  --debug
```

### Driver binaries
```bash
# If no build error then the driver (ifx_njs_bind.node) binaries will be at
C:\work\IfxNode\build\Debug
# or
C:\work\IfxNode\build\Release
```

#### Alternative build
```bash
# you may use the Visual Studio 2017 Solution to build from source
# FYI: you still need CSDK_HOME and NODE_SRC environment to be set
C:\work\IfxNode\IfxNodeJsVS2017.sln
```

#### [FYI: node-gyp build helps](https://github.com/nodejs/node-gyp)
```bash
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



---
### Preparing prebuilt binaries
This task is needed if you plan to use the binary for the next NPM release.

#### Cleanup build for prebuilt zip
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


#### Copy the ZIP to prebuilt folder
```bash
# Create a ZIP and copy to prebuilt folder
# you may use 7zip to create a zip of C:\work\IfxNode\build
# Then copy it to C:\work\IfxNode\prebuilt\Win64
del C:\work\IfxNode\prebuilt\Win64\build.zip
copy C:\work\IfxNode\build.zip C:\work\IfxNode\prebuilt\Win64\build.zip

### Update the Hash value in the readme
# Get the hash key of the build zip
certutil -hashfile C:\work\IfxNode\prebuilt\Win64\build.zip MD5

update "prebuilt\README.md" with the hash value.
```
