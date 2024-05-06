const { MongoClient } = require('mongodb');
const path = require('path');
const { parseToDateTimeFormat } = require('../functions/dateFormtter');
module.exports = class MongoService {
  client = undefined;
  timeToClear = undefined;
  constructor(connectionString) {
    this.client = new MongoClient(connectionString);
  }
  async getAllItems(dbName, collectionName) {
    try {
      const database = this.client.db(dbName);
      const collection = database.collection(collectionName);
      const cursor = await collection.find();
      const result = await cursor.toArray();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async addItems(dbName, collectionName, items, options = undefined) {
    try {
      const database = this.client.db(dbName);
      const collection = database.collection(collectionName);

      if (!options) {
        options = { ordered: true };
      }

      const result = await collection.insertMany(items, options);
      console.log(`${result.insertedCount} documents were inserted`);
    } catch (error) {
      console.log(error);
    }
  }
  async closeConnection() {
    await this.client.close();
  }
  async getItemsByDate(dbName, collectionName, dateToFind) {
    try {
      const database = this.client.db(dbName);
      const collection = database.collection(collectionName);

      const query = { date: dateToFind };
      const options = {
        sort: { time: 1 },
      };
      const cursor = collection.find(query, options);
      if ((await collection.countDocuments(query)) === 0) {
        console.log('No documents found!');
        return [];
      }
      const results = await cursor.toArray();
      return results;
    } catch (error) {
      console.log(error);
    }
  }
  async addItem(dbName, collectionName, item) {
    try {
      const database = this.client.db(dbName);
      const collection = database.collection(collectionName);
    } catch (error) {
      console.log(error);
    }
  }
  async removeSingleItemByDate(dbName, collectionName, date) {
    try {
      const database = this.client.db(dbName);
      const collection = database.collection(collectionName);
      const query = { date: new Date(date) };
      const res = await collection.findOneAndDelete(query);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  async removeManyItemsByDate(dbName, collectionName, date, endDate) {
    try {
      const database = this.client.db(dbName);
      const collection = database.collection(collectionName);
      const query = { date: { $gte: new Date(date), $lte: new Date(endDate) } };
      const res = await collection.deleteMany(query);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  async clearItemsByTime(time = undefined) {
    // під питанням, можливо краще дати змогу видаляти логи адміну, там
    // в ньго буде можливість видалити діапазон, посортувати, видалити одну...
    if (time) {
    } else {
    }
  }
};
