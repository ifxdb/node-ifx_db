

### The prebuilt operations in nutshell 
```bash
# Let us assume you plan to clone the driver code at /work/dev/t1
# rm -rf /work/dev/t1
mkdir /work/dev/t1
cd /work/dev/t1
npm install bindings
npm install nan
npm install fstream
npm install unzip
npm install node-gyp

cd /work/dev/t1/node_modules
git clone https://github.com/ifxdb/node-ifx_db.git

cd /work/dev/t1/node_modules/node-ifx_db
git checkout PreBuiltBin
# rm -rf ./.git

cd /work/dev/t1/node_modules/
mv  node-ifx_db     ifx_db
cd /work/dev/t1/node_modules/ifx_db
node installer/IfxDriverInstall.js

cp /work/dev/t1/node_modules/ifx_db/test/SampleApp1.js /work/dev/t1/.
cd /work/dev/t1
node SampleApp1.js
```
