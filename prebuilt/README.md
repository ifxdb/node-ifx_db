

#### Information about the prebuilt driver binaries

| **Platform** | **NodeJS Version** | **MD5 hash**
|:-------------|:-------------------|:----------------------------------------
| `Arm`        | node-v10.15.1      | 32fe1db63678160d1e6b2a9d50c73c43
| `Linux64`    | node-v10.15.1      | 1c8825df1a2058924684eeb426de58ec
| `Win64`      | node-v10.15.1      | 64fec168cd1f51c0c49ea5e4d1211084



#### Prepare Linux64 prebuild binary
```bash
cd /work/t1
rm -rf IfxNode
git clone https://github.com/OpenInformix/IfxNode.git

# cd /work/t1/IfxNode
cd IfxNode
npm update

rm -rf ./build
# npm install node-gyp
node-gyp configure -v
node-gyp build -v

rm ./build/binding.Makefile
rm ./build/config.gypi
rm ./build/ifx_njs_bind.target.mk
rm ./build/Makefile
rm -rf ./build/Release/.deps
rm -rf ./build/Release/obj.target

zip -r build.zip ./build

rm ./prebuilt/Linux64/build.zip
mv build.zip ./prebuilt/Linux64/build.zip
```

### Quick Test

##### Set runtime environment to pick Informix Client SDK libraries.
```bash
export INFORMIXDIR=/work/informix
export LD_LIBRARY_PATH=${INFORMIXDIR}/lib:${INFORMIXDIR}/lib/esql:${INFORMIXDIR}/lib/cli
``

```bash
cd ..
# cd /work/t1

rm -rf node_modules
mkdir  node_modules
cd node_modules
ln -s ../IfxNode ./ifxnjs
cd ..

# cd /work/t1
cp IfxNode/test/SampleApp1.js .

# edit connection string
vi SampleApp1.js

node SampleApp1.js
```

###  Checking Hash
```bash
cd /work/t1/IfxNode
md5sum ./prebuilt/Linux64/build.zip
# 88571f4ade8359188892d2e517b6555b  ./prebuilt/Linux64/build.zip

md5sum ./prebuilt/Arm/build.zip
# e07d745fe4bf5c461cccdce07406859f  ./prebuilt/Arm/build.zip

update the Hash and Checkin the repo
```



#### Windows Built in tools for checking Hash value
* [PowerShell.Utility](https://docs.microsoft.com/en-us/powershell/module/Microsoft.PowerShell.Utility/Get-FileHash?view=powershell-5.1)

* [certutil](https://technet.microsoft.com/library/cc732443.aspx)
```bat
cd C:\work\IfxNode\prebuilt\Win64
certutil -hashfile build.zip MD5
685ef0f84d3954ba1c7a0377a36908c4
```

---
### The prebuilt install operations in nutshell
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
git clone https://github.com/OpenInformix/IfxNode.git

cd /work/dev/t1/node_modules/IfxNode
#git checkout PreBuiltBin
# rm -rf ./.git

cd /work/dev/t1/node_modules/
mv  IfxNode     ifxnjs
cd /work/dev/t1/node_modules/ifxnjs
node installer/IfxDriverInstall.js

cp /work/dev/t1/node_modules/ifxnjs/test/SampleApp1.js /work/dev/t1/.
cd /work/dev/t1

# edit Connection String
vi SampleApp1.js

node SampleApp1.js
```
