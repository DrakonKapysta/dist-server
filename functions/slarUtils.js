exports.getRandomInt = function (max) {
  return Math.floor(Math.random() * max);
};

exports.getRandomFloat = function (max) {
  return Math.round(Math.random() * max * 100) / 100;
};

exports.generateSlar = function (
  amount,
  numberType = 'int',
  includeZero = false,
) {
  const slar = [];
  let getRandomValue = numberType == 'int' ? getRandomInt : getRandomFloat;
  for (let index = 0; index < amount; index++) {
    const equation = {
      x: getRandomValue(10) || (includeZero ? 0 : 1),
      y: getRandomValue(10) || (includeZero ? 0 : 1),
      z: getRandomValue(10) || (includeZero ? 0 : 1),
      result: getRandomValue(20),
    };
    slar.push(equation);
  }
  return slar;
};