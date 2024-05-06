const path = require('path');
module.exports = function (functionInfo, calledFrom, ...args) {
  console.log('-----------------------------------');
  console.log(`Called from: ${calledFrom}`);
  console.log(`Function: ${functionInfo.name} ---->`);

  const funcStr = functionInfo.toString();
  const result = funcStr
    .slice(funcStr.indexOf('(') + 1, funcStr.indexOf(')'))
    .match(/([^\s,]+)/g);

  console.log(`Params: ${result}`);

  for (const log of [...args]) {
    console.log(log);
  }
  console.log('-----------------------------------');
};
