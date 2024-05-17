const store = require('../store');
const { generateSlar } = require('../functions/slarUtils');
module.exports = function (db = undefined) {
  return async function (request, response) {
    if (
      request.params.pathname == '/task/generate' &&
      request.method == 'GET'
    ) {
      const systems = [];
      const equationAmount =
        request.params.searchParams.get('equationAmount') || 3;
      const systemAmount = request.params.searchParams.get('systemAmount') || 1;
      for (let index = 0; index < systemAmount; index++) {
        systems.push(generateSlar(equationAmount));
      }
      return response.send(systems);
    }
  };
};
