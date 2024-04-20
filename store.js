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
  getFormatedDate() {
    const currentDate = new Date();

    const formattedTime = `${this.padZero(
      currentDate.getHours(),
    )}:${this.padZero(currentDate.getMinutes())}:${this.padZero(
      currentDate.getSeconds(),
    )}`;
    const formattedDate = `${currentDate.getFullYear()}-${this.padZero(
      currentDate.getMonth() + 1,
    )}-${this.padZero(currentDate.getDate())}`;
    return { formattedDate, formattedTime };
  }
  addLog(log) {
    // Форматируем дату и время в нужном формате
    const formatedDateAndTime = this.getFormatedDate();
    formatedDateAndTime;
    this.tempLogs.push({
      log,
      time: formatedDateAndTime.formattedTime,
      date: formatedDateAndTime.formattedDate,
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
