

## New Release
Publishing a new version of the driver to NPM

### 1) Install new node.js version.
Install the new version of node.js that we plan our driver to upgrade.

### 2) Resolve compilation errors if any.
There may be breaking changes introduced by new version of node, resolve the problem and build the driver against the new node version.

### 3) Build & Test
Do a driver build on each supported platform and then perform sanity test with the driver binary.

### 4) Create prebuilt binary
Create prebuilt binaries for each of the platform we support.

---
## Publish to NPM

### 1) Verify prebuilt driver binaries
Verify prebuilt driver binaries are built with the right node.js version and it is checked in.

### 2) Increment Version

So far we kept our driver major version same as node.js major version. Then the remaining part we follow similar to NPM version increment conversion.

The general conversion for incrementing version by NPM is
```bash
# increment NPM Version
# no breaking change and no new functionality
--npm version patch

# new functionality added, but no breaking
--npm version minor

# breaking change
--npm version major
```

You may manually update the version attribute of **package.json** or run **npm version xyz**.
```bash
# cd /work/IfxNode
# cd C:\work\IfxNode

# eg:
npm version patch
```

### 3) npm publish
```bash
# you may have to add npm user on the system before publish.
# npm adduser

npm cache clean --force
npm version patch
npm publish
```


