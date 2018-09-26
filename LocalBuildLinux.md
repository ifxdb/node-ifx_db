## Linux Build
--------------
**FYI:** Make sure bit architectures matches for all binary components; if you are using 64bit nodejs make sure you are using 64bit Informix Client-SDK as well.

#### FYI:
* [Node.js breaking changes between v4 LTS and v6 LTS](https://github.com/nodejs/node/wiki/Breaking-changes-between-v4-LTS-and-v6-LTS)
* [Node.js community wiki](https://github.com/nodejs/node/wiki)


### Prerequisite :
* Informix Client SDK 410 xC2 or above
* Git
* NodeJS
* Python     2.7
* Node-gyp   (npm install -g node-gyp)
* NAN        (npm install -g nan)

#### Install Node.js
```bash
# Remove old nodejs installation if any
sudo apt-get remove nodejs nodejs-legacy -y
sudo apt-get remove npm  -y

# Install 8x nodejs
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### FYI: Make sure you have the right node.js
```bash
# rm /work/dev/nodejs
# cd /work/dev

###### if 64bit Linux on x86
wget https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.xz
tar -xvf node-v8.9.4-linux-x64.tar.xz
sudo ln -s  /work/dev/node-v8.9.4-linux-x64  /work/dev/nodejs

###### if ARM v7 (Raspberry Pi 3)
# sudo wget https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-armv7l.tar.xz
# sudo tar -xvf node-v8.9.4-linux-armv7l.tar.xz
# sudo ln -s  /work/dev/node-v8.9.4-linux-armv7l  /work/dev/nodejs

# export PATH=/work/dev/nodejs/bin:$PATH
which node
node -v
```

#### Complile time environment
```bash
# sudo ln -s /opt/csdk410FC12 /work/csdk
# Assuming 'CSDK' is installed at /work/csdk
export CSDK_HOME=/work/csdk
```

### Fire the build
```bash
cd /work/t1
git clone https://github.com/OpenInformix/IfxNode.git

cd /work/t1/IfxNode
npm update

rm -rf ./build
npm install -g node-gyp
# Raspberry Pi 3
# sudo npm install -g node-gyp

node-gyp configure -v
node-gyp build -v
```

#### check the build output, if all right then the driver binary is
```bash
ls -l ./build/Release/ifx_njs_bind.node
```

#### FYI only: Build Cleanup
```bash
rm /work/t1/IfxNode/build/binding.Makefile
rm /work/t1/IfxNode/build/config.gypi
rm /work/t1/IfxNode/build/ifx_njs_bind.target.mk
rm /work/t1/IfxNode/build/Makefile
rm -rf /work/t1/IfxNode/build/Release/obj.target
rm -rf /work/t1/IfxNode/build/Release/.deps

# apt-get update
# apt-get install zip unzip

#### preparing it for prebuilt
cd /work/t1/IfxNode
zip -r build.zip ./build
# mv build.zip ./prebuilt/Linux64/build.zip
# mv build.zip ./prebuilt/Arm/build.zip
rm -rf ./build
```

### Quick test of the local build
---------------------------------

##### Get a sample code
```bash
cd /work/try
rm -rf /work/try/node_modules
mkdir /work/try/node_modules

ln -s  /work/t1/IfxNode  /work/try/node_modules/ifxnjs
cp /work/t1/IfxNode/test/SampleApp1.js .
```

##### Set runtime environment to pick Informix Client SDK libraries.
```bash
export INFORMIXDIR=/work/csdk
export LD_LIBRARY_PATH=${INFORMIXDIR}/lib:${INFORMIXDIR}/lib/esql:${INFORMIXDIR}/lib/cli
# Set the INFORMIXSQLHOSTS too, say
# export INFORMIXSQLHOSTS=/work/dev/srv/ids0/sqlhosts
```

##### Run the sample
```bash
#cd /work/try
vi SampleApp1.js

# edit Connection Informaton and then run
node SampleApp1.js
```

#### FYI: Run time error observed after upgrading to node.js v8x
```bash
node SampleApp1.js

Error: Cannot find module 'q'
    at Function.Module._resolveFilename (module.js:538:15)
    at Function.Module._load (module.js:468:25)
    at Module.require (module.js:587:17)
    at require (internal/module.js:11:18)
    at Object.<anonymous> (/work/t1/IfxNode/lib/odbc.js:37:9)
    at Module._compile (module.js:643:30)
    at Object.Module._extensions..js (module.js:654:10)
    at Module.load (module.js:556:32)
    at tryModuleLoad (module.js:499:12)
    at Function.Module._load (module.js:491:3)

###### Solution
npm install -g q
```


