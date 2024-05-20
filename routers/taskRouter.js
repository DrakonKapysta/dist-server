const loadBalancer = require('../LoadBalancerWRR');
const {
  generateSlar,
  getRandomInt,
  generateDiagonalSlar,
} = require('../functions/slarUtils');
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
      const diaglonal = request.params.searchParams.get('diagonal') || false;

      for (let index = 0; index < systemAmount; index++) {
        if (diaglonal) {
          systems.push(generateDiagonalSlar(equationAmount));
        } else {
          systems.push(generateSlar(equationAmount));
        }
      }
      loadBalancer.addRequests(systems);
      return response.send(systems);
    }
  };
};
