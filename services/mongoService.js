const { MongoClient } = require('mongodb');
const path = require('path');
const { parseToDateTimeFormat } = require('../functions/dateFormtter');
module.exports = class MongoService {
  client = undefined;
  constructor(connectionString) {
    this.client = new MongoClient(connectionString);
  }
  getMongoClient() {
    return this.client;
  }
  async closeConnection() {
    await this.client.close();
  }
};
