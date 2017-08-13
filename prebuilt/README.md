

#### Information about the prebuilt driver binaries

| **Platform** | **NodeJS Version** | **MD5 hash**
|:-------------|:-------------------|:----------------------------------------
| `Win64`      | node-v6.11.2       | 685ef0f84d3954ba1c7a0377a36908c4
| `Arm64`      | node-v6.11.2       | 
| `Linux64`    | node-v6.11.2       | 


### Windows Built in tools for Hash 
* [PowerShell.Utility](https://docs.microsoft.com/en-us/powershell/module/Microsoft.PowerShell.Utility/Get-FileHash?view=powershell-5.1)

* [certutil](https://technet.microsoft.com/library/cc732443.aspx)
```
cd C:\work\node-ifx_db\prebuilt\Win64
certutil -hashfile build.zip MD5
68 5e f0 f8 4d 39 54 ba 1c 7a 03 77 a3 69 08 c4
```

