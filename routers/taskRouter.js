const store = require('../store');
const { generateSlar, getRandomInt } = require('../functions/slarUtils');
module.exports = function (db = undefined) {
  return async function (request, response) {
    if (
      request.params.pathname == '/task/generate' &&
      request.method == 'GET'
    ) {
      const systems = [];
      const isRandom = request.params.searchParams.get('random') || false;
      const equationAmount =
        request.params.searchParams.get('equationAmount') ||
        (isRandom ? getRandomInt(10) : 3);
      const systemAmount =
        request.params.searchParams.get('systemAmount') ||
        (isRandom ? getRandomInt(10) : 1);
      console.log(equationAmount);
      console.log(systemAmount);
      for (let index = 0; index < systemAmount; index++) {
        systems.push(generateSlar(equationAmount));
      }
      return response.send(systems);
    }
  };
};
