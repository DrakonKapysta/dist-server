exports.getRandomInt = getRandomInt;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

exports.getRandomFloat = getRandomFloat;

function getRandomFloat(max) {
  return Math.round(Math.random() * max * 100) / 100;
}

exports.generateSlar = function (
  amount,
  numberType = 'int',
  includeZero = false,
) {
  const axMatrix = [];
  const bMatrix = [];
  let getRandomValue = numberType == 'int' ? getRandomInt : getRandomFloat;
  for (let index = 0; index < amount; index++) {
    axMatrix.push([
      getRandomValue(10) || (includeZero ? 0 : 1),
      getRandomValue(10) || (includeZero ? 0 : 1),
      getRandomValue(10) || (includeZero ? 0 : 1),
    ]);
    bMatrix.push(getRandomValue(20));
  }
  return {
    A: axMatrix,
    b: bMatrix,
    method: 'jacobi',
    tolerance: 0.01,
    maxIterations: 100,
  };
};
