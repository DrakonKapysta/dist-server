const { getTodaysDateWithoutTime } = require('../functions/dateFormtter');
module.exports = class StatisticService {
  client = undefined;
  _dbName = undefined;
  _collectionName = undefined;
  constructor(client, dbName, collectionName) {
    this.client = client;
    this._collectionName = collectionName;
    this._dbName = dbName;
  }
  async getAllStat() {
    try {
      const database = this.client.db(this._dbName);
      const collection = database.collection(this._collectionName);
      const result = await collection.find().toArray();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async findByDate(date) {
    try {
      const database = this.client.db(this._dbName);
      const collection = database.collection(this._collectionName);
      const filter = {
        connectionsInfo: {
          $elemMatch: {
            date: date,
          },
        },
      };
      const result = await collection.findOne(filter);
      return result;
    } catch (error) {}
  }
  async updateStat(store) {
    // на майбутнє, поки не чіпати!!!! Багато багів
    try {
      const database = this.client.db(this._dbName);
      const collection = database.collection(this._collectionName);
      const filter = { _id: 'serverStatistics' };
      const options = {
        upsert: true,
      };
      const connectionByDate = await this.findByDate(
        getTodaysDateWithoutTime(),
      );
      if (!connectionByDate) {
        const updateDoc = {
          $inc: { totalConnections: store.tempStat.totalConnections },
          $concatArrays: ['$connectionsInfo', [store.tempStat.connectionsInfo]],
          $set: {},
        };
      }

      // const result = await collection.updateOne(filter, updateDoc, options);
      // console.log(
      //   `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      // );
    } catch (error) {
      console.log('Error during statistics update:', error);
    }
  }
};
