const fs = require('fs');
const path = require('path');

const nextjsPackageJsonPath = path.resolve(
  __dirname,
  '../packages/nextjs/package.json',
);
const serverPackageJsonPath = path.resolve(
  __dirname,
  '../packages/server/package.json',
);

const nextjsPackageJson = require(nextjsPackageJsonPath);
const serverPackageJson = require(serverPackageJsonPath);

if (nextjsPackageJson.dependencies) {
  for (const [key, value] of Object.entries(nextjsPackageJson.dependencies)) {
    if (value.startsWith('workspace:')) {
      nextjsPackageJson.dependencies[key] = `^${serverPackageJson.version}`;
    }
  }
}

fs.writeFileSync(
  nextjsPackageJsonPath,
  JSON.stringify(nextjsPackageJson, null, 2),
);
console.log(
  'Updated dependencies in nextjs/package.json:',
  nextjsPackageJson.dependencies,
);
