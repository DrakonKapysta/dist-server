const { MongoClient } = require('mongodb');
module.exports = class MongoService {
  client = undefined;
  constructor(connectionString) {
    this.client = new MongoClient(connectionString);
  }
  async getLogs() {
    try {
      const database = this.client.db('dest-server');
      const collection = database.collection('logs');
      const logs = await collection.find();
      console.log(logsCursor);
    } catch (err) {
      console.log(err);
    }
  }
  async addLogs(logs) {
    try {
      const database = this.client.db('dest-server');
      const collection = database.collection('logs');

      const options = { ordered: true };

      const result = await collection.insertMany(logs, options);
      console.log(`${result.insertedCount} documents were inserted`);
    } catch (error) {
      console.log(error);
    }
    this.getLogsByDate('2024-04-21');
  }
  async closeConnection() {
    await this.client.close();
  }
  async getLogsByDate(dateToFind) {
    try {
      const database = this.client.db('dest-server');
      const collection = database.collection('logs');

      const query = { date: dateToFind };
      const options = {
        // Sort returned documents in ascending order by title (A->Z)
        sort: { time: 1 },
      };
      const cursor = collection.find(query, options);
      if ((await collection.countDocuments(query)) === 0) {
        console.log('No documents found!');
        return;
      }
      const results = await cursor.toArray();
      console.log(results);
    } catch (error) {
      console.log(error);
    }
  }
  async addSingleLog(log) {}
};
