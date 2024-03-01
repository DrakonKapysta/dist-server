class Store {
  constructor() {
    this.clients = new Map();
  }
  setPayload(sockeId, payload) {
    this.clients.set(sockeId, payload);
  }
  getClientInfo(sessionId) {
    if (this.clients.has(sessionId)) {
      return this.clients.get(sessionId);
    }
    return null;
  }
  getClients() {
    const clientsArray = [];
    for (const [socketId, info] of this.clients) {
      clientsArray.push({ ...info, socketId });
    }
    return clientsArray;
  }
}
module.exports = new Store();
