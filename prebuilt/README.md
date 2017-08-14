

#### Information about the prebuilt driver binaries

| **Platform** | **NodeJS Version** | **MD5 hash**
|:-------------|:-------------------|:----------------------------------------
| `Win64`      | node-v6.11.2       | 685ef0f84d3954ba1c7a0377a36908c4
| `Arm64`      | node-v6.11.2       | 
| `Linux64`    | node-v6.11.2       | 59b543dea0c08e0c29eb46fd769c5b5d


###  Checking Hash 
#### Linux
```
cd /work/dev/node-ifx_db/
zip -r build.zip ./build

md5sum build.zip
59b543dea0c08e0c29eb46fd769c5b5d  build.zip
```

#### Windows Built in tools for checking Hash value
* [PowerShell.Utility](https://docs.microsoft.com/en-us/powershell/module/Microsoft.PowerShell.Utility/Get-FileHash?view=powershell-5.1)

* [certutil](https://technet.microsoft.com/library/cc732443.aspx)
```
cd C:\work\node-ifx_db\prebuilt\Win64
certutil -hashfile build.zip MD5
685ef0f84d3954ba1c7a0377a36908c4
```

