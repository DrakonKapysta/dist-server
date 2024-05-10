const balancer = require('../LoadBalancerWRR');

module.exports = function (db = undefined) {
  return async (req, res) => {
    const dbName = 'dest-server';
    const collectionName = 'requests';
    if (
      req.params.pathname == '/requests/addRequests' &&
      req.method == 'POST'
    ) {
      balancer.addRequests(req.body.requests);
      res.send({ message: 'successfuly' });
    }
    if (
      req.params.pathname == '/requests/addSingleRequest' &&
      req.method == 'POST'
    ) {
      balancer.addSingleRequest(req.body.request);
      res.send({ message: 'successfuly' });
    }
  };
};
