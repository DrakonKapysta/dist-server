module.exports = class Router {
  routers = new Map();
  constructor() {}
  registerRouter(routerName, router) {
    this.routers.set(routerName, router);
  }
  executeRouter(req, res) {
    const routerName = req.params.pathname.split('/')[1];
    if (!this.routers.has(routerName)) {
      res.send({ message: 'There is no such router' });
      return;
    }
    this.routers.get(routerName)(req, res);
  }
};
