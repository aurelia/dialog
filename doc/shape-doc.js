"use strict";

const path = require('path');
const fs = require('fs');
const apiJsonPath = path.resolve(__dirname, './api.json');

try {
  let json = require(apiJsonPath);

  json = {
    name: json.name,
    children: json.children[0].children,
    groups: json.children[0].groups
  };

  let str = JSON.stringify(json) + '\n';
  // typedoc adds the absolute path for lib.*.d.ts(lib.es5.d.ts, ...) files, leave only file name
  str = str.replace(/("fileName":\s*")[^"]+(lib\.[^"]+\.d\.ts)(",)/g, '$1$2$3');
  fs.writeFileSync(apiJsonPath, str);
  console.log('Shaped the doc/api.json file.');
} catch (e) {
  console.error('Unable to shape the api.json. The file probably has an incorrect format or doesn\'t exist.');
  console.error(e.message);
}
