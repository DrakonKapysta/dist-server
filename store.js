const { getFormatedDate } = require('./functions/dateFormtter');
class Store {
  tempLogs = [];
  constructor() {
    this.clients = new Map();
  }
  setPayload(socketId, payload) {
    this.clients.set(socketId, payload);
  }
  getClientInfo(socketId) {
    if (this.clients.has(socketId)) {
      return this.clients.get(socketId);
    }
    return null;
  }
  padZero(number) {
    return number < 10 ? '0' + number : number;
  }
  addLog(log) {
    this.tempLogs.push({
      log,
      date: new Date(),
    });
  }
  getNextComputer() {}
  getClients() {
    const clientsArray = [];
    for (const [socketId, info] of this.clients) {
      clientsArray.push({ ...info });
    }
    //console.log(clientsArray[0]);
    return clientsArray;
  }
  removeClient(socketId) {
    if (this.clients.has(socketId)) {
      this.clients.delete(socketId);
    }
  }
}
module.exports = new Store();
