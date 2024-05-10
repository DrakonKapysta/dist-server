const { getFormatedDate } = require('./functions/dateFormtter');
class Store {
  tempLogs = [];
  tempStat = {
    _id: 'serverStatistic',
    totalConnections: 0,

    connectionsInfo: [
      {
        date: undefined,
        connectionCount: 0,
        connectionList: [],
      },
    ],
  };
  statChanged = false;
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

  addNewConnectionToStat() {
    this.tempStat.totalConnections += 1;
    console.log(this.tempStat.totalConnections);
    const date = new Date();
    const parsedDate = `${date.getFullYear()} ${
      date.getMonth() + 1
    } ${date.getDate()}`;
    if (this.tempStat.connectionsInfo.length == 0) {
      const newConnectionObj = {
        date: parsedDate,
        connectionCount: 1,
      };
      this.tempStat.connectionsInfo.push(newConnectionObj);
      return;
    }
    const connectionByDate = this.tempStat.connectionsInfo.find(
      (connection) => connection.date == parsedDate,
    );
    if (connectionByDate) {
      connectionByDate.connectionCount += 1;
      return;
    } else {
      const newConnectionObj = {
        date: parsedDate,
        connectionCount: 1,
      };
      this.tempStat.connectionsInfo.push(newConnectionObj);
      return;
    }
  }
}
module.exports = new Store();
