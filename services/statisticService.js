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
};
