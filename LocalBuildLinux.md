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

### Update Packages
```bash
sudo apt-get update
sudo apt-get dist-upgrade
```


### Install Node.js
```bash
# Remove old nodejs installation if any
sudo apt-get remove nodejs nodejs-legacy -y
sudo apt-get remove npm  -y

# Install nodejs
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### FYI: Make sure you have the right version of node.js installed

```bash
rm /work/dev/nodejs
cd /work/dev
```

#### If 64bit Linux on x86
```bash
wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-linux-x64.tar.xz
tar -xvf node-v10.15.1-linux-x64.tar.xz
sudo ln -s  /work/dev/node-v10.15.1-linux-x64  /work/dev/nodejs
```

#### If ARM v7 (Raspberry Pi 3)
```bash
sudo wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-linux-armv7l.tar.xz
sudo tar -xvf node-v10.15.1-linux-armv7l.tar.xz
sudo ln -s  /work/dev/node-v10.15.1-linux-armv7l  /work/dev/nodejs
```

```bash
export PATH=/work/dev/nodejs/bin:$PATH
which node
node -v
```

#### Complile time environment
```bash
# sudo ln -s /opt/csdk450FC1 /work/csdk
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


---
### Preparing it for prebuilt
Do this only if you plan to do a public release with the build binary.
```bash
# Build Cleanup
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

# if Linu x64 then
mv build.zip ./prebuilt/Linux64/build.zip

# ARM then only
# mv build.zip ./prebuilt/Arm/build.zip

# get the md5hash
md5sum    build.zip
# update prebuilt/README.md with the hash value.

# Check-in the changes.
```
