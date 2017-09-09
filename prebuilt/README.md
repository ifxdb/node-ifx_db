

#### Information about the prebuilt driver binaries

| **Platform** | **NodeJS Version** | **MD5 hash**
|:-------------|:-------------------|:----------------------------------------
| `Win64`      | node-v6.11.2       | 685ef0f84d3954ba1c7a0377a36908c4
| `Arm64`      | node-v6.11.2       | 
| `Linux64`    | node-v6.11.2       | 6901472318b1b3173f8633b5f402daf4


 
#### Prepare Linux64 prebuild binary 
```bash
git clone https://github.com/ifxdb/IfxNode.git

cd IfxNode
npm update

rm -rf ./build  
node-gyp configure -v  
node-gyp build -v  

rm ./build/binding.Makefile  
rm ./build/config.gypi  
rm ./build/ifx_node_bind.target.mk  
rm ./build/Makefile 
rm -rf ./build/Release/.deps
rm -rf ./build/Release/obj.target

zip -r build.zip ./build

rm ./prebuilt/Linux64/build.zip
mv build.zip ./prebuilt/Linux64/build.zip
```

### Quick Test 
```
cd ..
rm -rf node_modules
mkdir  node_modules
cd node_modules
ln -s ../IfxNode ./ifx_db
cd ..
cp IfxNode/test/SampleApp1.js .
node SampleApp1.js
```

###  Checking Hash
```
cd cd IfxNode
md5sum ./prebuilt/Linux64/build.zip
6901472318b1b3173f8633b5f402daf4  ./prebuilt/Linux64/build.zip

update the Hash and Checkin the repo
```



#### Windows Built in tools for checking Hash value
* [PowerShell.Utility](https://docs.microsoft.com/en-us/powershell/module/Microsoft.PowerShell.Utility/Get-FileHash?view=powershell-5.1)

* [certutil](https://technet.microsoft.com/library/cc732443.aspx)
```
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
git clone https://github.com/ifxdb/IfxNode.git

cd /work/dev/t1/node_modules/IfxNode
#git checkout PreBuiltBin
# rm -rf ./.git

cd /work/dev/t1/node_modules/
mv  IfxNode     ifx_db
cd /work/dev/t1/node_modules/ifx_db
node installer/IfxDriverInstall.js

cp /work/dev/t1/node_modules/ifx_db/test/SampleApp1.js /work/dev/t1/.
cd /work/dev/t1
node SampleApp1.js
```
