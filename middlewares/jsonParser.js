const { encrypt } = require('../functions/cryptoUtils');

module.exports = function (req, res, next) {
  res.send = (message) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const jsonData = JSON.stringify(message);
    res.end(encrypt(jsonData, process.env.SECRET_KEY));
  };
  next();
};
