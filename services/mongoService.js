const { MongoClient } = require('mongodb');
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
  async getItemsByTime(dbName, collectionName, time) {
    try {
      const database = this.client.db(dbName);
      const collection = database.collection(collectionName);

      const query = { time: time };
      const options = {
        // Sort returned documents in ascending order by title (A->Z)
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
  async getItemsByDateAndTime(dbName, collectionName, date, time) {
    try {
      const database = this.client.db(dbName);
      const collection = database.collection(collectionName);

      const query = { time, date };
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
  async removeSingleItemByDateAndTime(dbName, collectionName, date, time) {
    try {
      const database = this.client.db(dbName);
      const collection = database.collection(collectionName);
      const query = { time, date };
      const res = await collection.findOneAndDelete(query);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  async removeManyItemsByDateAndTime(
    dbName,
    collectionName,
    date,
    time,
    endDate,
    endTime,
  ) {
    try {
      const database = this.client.db(dbName);
      const collection = database.collection(collectionName);
      const startDateObj = new Date(date);
      const endDateObj = new Date(endDate);
      console.log(startDateObj, endDateObj);
      console.log(startTimeObj, endTimeObj);
      const query = {
        date: { $gte: startDateObj, $lte: endDateObj },
        time: { $gte: startTimeObj, $lte: endTimeObj },
      };
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
