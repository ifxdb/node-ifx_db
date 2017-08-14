

### The prebuilt operations in nutshell 
```bash
mkdir /work/dev/t1
cd /work/dev/t1
npm install bindings

cd /work/dev/t1/node_modules
git clone https://github.com/ifxdb/node-ifx_db.git

cd /work/dev/t1/node_modules/node-ifx_db
git checkout PreBuiltBin
#rm -rf ./.git

npm install nan
npm install fstream
npm install unzip
npm install node-gyp

cd /work/dev/t1/node_modules/
mv node-ifx_db ifx_db
cd /work/dev/t1/node_modules/ifx_db
node installer/IfxDriverInstall.js

cp /work/dev/t1/node_modules/ifx_db/test/SampleApp1.js /work/dev/t1/.
cd /work/dev/t1
node SampleApp1.js
```
