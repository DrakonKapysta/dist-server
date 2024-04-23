module.exports = class Router {
  routers = new Map();
  constructor() {}
  registerRouter(pathname, router) {
    this.routers.set(pathname, router);
  }
  startRouting(req, res) {
    const pathname = req.params.pathname.split('/')[1];
    if (!this.routers.has(pathname)) {
      res.send({ message: 'There is no such router' });
      return;
    }
    this.routers.get(pathname)(req, res);
  }
};
