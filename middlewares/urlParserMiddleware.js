module.exports = function urlParser(req, res, next) {
  const path = new URL(req.url, `http://${req.headers.host}`);
  req.params = path;
  console.log(req.params);
  next();
};
