class Store {
  constructor() {
    this.clients = new Map();
  }
  setPayload(sockeId, payload) {
    this.clients.set(sockeId, payload);
  }
  getClientInfo(socketId) {
    if (this.clients.has(socketId)) {
      return this.clients.get(socketId);
    }
    return null;
  }
  getNextComputer() {}
  getClients() {
    const clientsArray = [];
    for (const [socketId, info] of this.clients) {
      clientsArray.push({ ...info, socketId });
    }
    return clientsArray;
  }
  removeClient(socketId) {
    if (this.clients.has(socketId)) {
      this.clients.delete(socketId);
    }
  }
}
module.exports = new Store();
