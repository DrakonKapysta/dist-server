module.exports = function jsonParserMiddleware(req, res, next) {
  res.send = (message) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(message));
  };
  next();
};
