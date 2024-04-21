module.exports = function (req, res) {
  if ((req.params.pathname == '/logs', req.method == 'GET')) {
    res.send({ message: 'GOOD' });
  }
  if ((req.params.pathname == '/logs/remove', req.method == 'DELETE')) {
    res.send({ message: 'GOOD' });
  }
};
