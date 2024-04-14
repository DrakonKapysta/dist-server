class LoadBalancer {
  sockets = new Map();
  maxWeight = 0;
  io = undefined;
  isWorking = true;
  requests = [];
  workers = [];
  logs = [];
  adminNamespace = undefined;
  requestCounter = 1;
  isQueueNext = false;
  queuedMaxWeight = undefined;
  queuedRequests = [];
  refreshRequests() {
    this.requests = [...this.queuedRequests];
    this.queuedRequests = [];
    if (this.queuedMaxWeight) {
      this.maxWeight = this.queuedMaxWeight;
    }
  }
  addAdminNamespace(namespace) {
    this.adminNamespace = namespace;
  }
  addSocket(socket) {
    this.sockets.set(socket.id, socket);
  }
  addWorker(worker) {
    this.workers.push(worker);
  }
  setSocektIoInstance(io) {
    this.io = io;
  }
  logDataToAdmin(data, socketId) {
    this.adminNamespace.emit('admin:log', data.join('\n'), socketId);
  }
  async iwrr() {
    for (let round = 1; round <= this.maxWeight; round++) {
      if (this.requests.length === 0) {
        console.log('Waiting for requests');
        break;
      }
      for (let i = 0; i < this.workers.length; i++) {
        if (this.requests.length === 0) {
          break;
        }
        if (round <= this.workers[i].weight) {
          this.sockets
            .get(this.workers[i].socketId)
            .emit(
              'request:task',
              'New task ' + this.requestCounter,
              (responce) => {
                if (responce.status == 'ok') {
                  this.workers[i].totalSuccessfulRequests += 1;

                  this.adminNamespace.emit('admin:incrementSuccessfulRequest', {
                    workerId: this.workers[i].socketId,
                  });
                }
                if (responce.status == 'err') {
                  this.workers[i].totalErrorRequests += 1;
                  this.adminNamespace.emit('admin:incrementErrorRequest', {
                    workerId: this.workers[i].socketId,
                  });
                }
              },
            );
          this.logs.push(
            'Worker with id: ' +
              this.workers[i].socketId[0] +
              ' round: ' +
              round,
          );
          this.workers[i].totalRequestCount += 1;
          console.log('total ' + this.workers[i].totalRequestCount);
          this.adminNamespace.emit('admin:incrementRequest', {
            workerId: this.workers[i].socketId,
          });

          this.requestCounter++;
          this.requests.pop();
        }
        if (this.logs.length >= 10) {
          console.log('LOG');
          this.logDataToAdmin(this.logs, this.workers[i].socketId);
          this.logs.length = 0;
        }
      }
    }
    await Promise.resolve();
  }
  stopNextCycle() {
    this.isWorking = false;
  }
  setMaxWeight(weight) {
    if (this.maxWeight && this.maxWeight < weight) {
      this.maxWeight = weight;
    }
    if (this.maxWeight === 0) {
      this.maxWeight = weight;
    }
  }
}
module.exports = new LoadBalancer();
