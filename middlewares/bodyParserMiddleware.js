const { decrypt } = require('../functions/cryptoUtils');

module.exports = function bodyParser(req, res, next) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    if (body !== '') {
      req.body = JSON.parse(decrypt(body, process.env.SECRET_KEY));
    }
    next();
  });
};
