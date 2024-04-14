class LoadBlancerWRR {
  workers = []; //under question
  adminNamespace = undefined;
  sockets = new Map();
  requestList = [];
  io = undefined;

  setAdminNamespace(namespace) {
    this.adminNamespace = namespace;
  }
  addSocket(socket) {
    this.sockets.set(socket.id, socket);
  }
  addRequest(req) {
    this.requestList.push(req);
  }
  addWorker(worker) {
    this.workers.push(worker);
  }
  setSocektIoInstance(io) {
    this.io = io;
  }

  async WRR() {
    const intervalDesc = setInterval(() => {}, 2000);
    console.log('Wrr started');
    //Handle errors ========================= start
    if (!this.workers.length) {
      console.error('There are no workers to perform tasks');
      return;
    }
    if (!this.requestList.length) {
      console.error('There are no tasks to perform');
      return;
    }
    //Handle errors ========================= end

    let workerIndex = 0;
    while (this.requestList.length) {
      while (this.workers[workerIndex].weight <= 0) {
        workerIndex++;
        if (workerIndex == this.workers.length) {
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

      this.workers[workerIndex].taskQueue.push(task);
      // <--------Sending task to worker---------->
      const sendReqToAdmin = async (index) => {
        this.sockets
          .get(this.workers[index].socketId)
          .emit('request:task', task, (responce) => {
            if (responce.status == 'ok') {
              this.workers[index].requests.totalSuccessfulRequests += 1;
              // переробити це гавно, +1 до реквеста кал тупо, дуже багато запитів які ніяк не обмежити в часі.
              // зробити таймер на секунду і кидати кожну 1-2 секунди this.workers[index].totalSuccessfulRequests і
              // переробити це на структуру в якій буде все зразу.
              // типу зробити 1 спільний admin:workerRequest з стуктурою payload: {totalSuccessfulRequests, totalErrorRequest}
              // this.adminNamespace.emit('admin:incrementSuccessfulRequest', {
              //   workerId: this.workers[index].socketId,
              // });
            }
            if (responce.status == 'err') {
              this.workers[index].requests.totalErrorRequests += 1;
              // this.adminNamespace.emit('admin:incrementErrorRequest', {
              //   workerId: this.workers[index].socketId,
              // });
            }
          });
      };
      sendReqToAdmin(workerIndex);

      this.workers[workerIndex].requests.totalRequestCount += 1;
      // this.adminNamespace.emit('admin:incrementRequest', {
      //   workerId: this.workers[workerIndex].socketId,
      // });
      // <--------Sending task to worker---------->

      this.workers[workerIndex].weight--;
    }
    clearInterval(intervalDesc);
  }
}
module.exports = new LoadBlancerWRR();
