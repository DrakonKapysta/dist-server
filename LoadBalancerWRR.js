const path = require('path');
const { decrypt, encrypt } = require('./functions/cryptoUtils');
class LoadBlancerWRR {
  workers = [];
  adminNamespace = undefined;
  sockets = new Map();
  requestList = [];
  io = undefined;
  sendingRequestInterval = undefined;

  setAdminNamespace(namespace) {
    this.adminNamespace = namespace;
  }
  removeWorker(socketId) {
    let workerIndex = undefined;
    this.workers.find((worker, index) => {
      if (worker.socketId == socketId) {
        workerIndex = index;
        return true;
      }
    });
    this.workers.splice(workerIndex, 1);
  }
  addSocket(socket) {
    this.sockets.set(socket.id, socket);
  }
  addRequests(requests) {
    this.requestList.push(...requests);
  }
  addSingleRequest(request) {
    this.requestList.push(request);
  }
  addWorker(worker) {
    this.workers.push(worker);
  }
  setSocektIoInstance(io) {
    this.io = io;
  }
  startSendingRequestInfo() {
    this.sendingRequestInterval = setInterval(() => {
      for (const worker of this.workers) {
        this.adminNamespace.emit('admin:workerRequest', {
          workerId: worker.socketId,
          requests: worker.requests,
        });
      }
    }, 2000);
  }
  startLoggToAdmin() {} //http
  stopSending() {
    clearInterval(this.sendingRequestInterval);
  }
  async sendTaskToWorker(index, task) {
    this.sockets
      .get(this.workers[index].socketId)
      .emit(
        'request:task',
        encrypt(task, process.env.SECRET_KEY),
        (responce) => {
          if (responce.status == 'ok') {
            this.workers[index].requests.totalSuccessfulRequests += 1;
            console.log(responce.payload);
          }
          if (responce.status == 'error') {
            this.workers[index].requests.totalErrorRequests += 1;
            //console.log(responce.payload.message);
          }
        },
      );
  }

  async WRR() {
    //console.log('Wrr started');
    //Handle errors ========================= start
    if (!this.workers.length) {
      //console.error('There are no workers to perform tasks');
      return;
    }
    if (!this.requestList.length) {
      //console.error('There are no tasks to perform');
      return;
    }
    //Handle errors ========================= end

    let workerIndex = 0;
    while (this.requestList.length) {
      while (this.workers[workerIndex].weight <= 0) {
        console.dir(this.workers);
        workerIndex++;
        if (workerIndex >= this.workers.length) {
          for (let index = 0; index < this.workers.length; index++) {
            this.workers[index].weight = this.workers[index].originalWeight;
          }
          workerIndex = 0;
          await new Promise((resolve) => setImmediate(resolve));
          break;
        }
      }
      const task = this.requestList.shift();
      if (task == undefined) {
        console.error('Task undefiner error');
        return;
      }

      //this.workers[workerIndex].taskQueue.push(task);
      // <--------Sending task to worker---------->

      this.sendTaskToWorker(workerIndex, task);

      // <--------Sending task to worker---------->
      this.workers[workerIndex].requests.totalRequestCount += 1;

      this.workers[workerIndex].weight--;
    }
  }
}
module.exports = new LoadBlancerWRR();
