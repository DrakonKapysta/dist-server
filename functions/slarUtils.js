exports.generateDiagonalSlar = function generateDiagonalSlar(
  amount,
  numberType = 'int',
  includeZero = false,
) {
  const axMatrix = [];
  const bMatrix = [];
  let getRandomValue = numberType == 'int' ? getRandomInt : getRandomFloat;
  for (let index = 0; index < amount; index++) {
    const coefs = [];
    for (let coefIndex = 0; coefIndex < amount; coefIndex++) {
      coefs.push(getRandomValue(10) || (includeZero ? 0 : 1));
    }
    axMatrix.push([...coefs]);
    coefs.length = 0;
    for (let j = 0; j < axMatrix[0].length; j++) {
      if (j == index) {
        const sum = axMatrix[index].reduce((sum, current, currentIndex) => {
          if (currentIndex != index) sum = Math.abs(sum) + Math.abs(current);
          return sum;
        }, 0);
        axMatrix[index][index] = sum + getRandomValue(10);
      }
    }
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
    const coefs = [];
    for (let coefIndex = 0; coefIndex < amount; coefIndex++) {
      coefs.push(getRandomValue(10) || (includeZero ? 0 : 1));
    }
    axMatrix.push([...coefs]);
    coefs.length = 0;
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
