const { parseToDateTimeFormat } = require('../functions/dateFormtter');
const store = require('../store');
module.exports = function (db = undefined) {
  return async function (request, response) {
    const dbName = 'dest-server';
    const collectionName = 'logs';
    if (
      request.params.pathname == '/logs/date-provided' &&
      request.method == 'GET'
    ) {
      if (db) {
        const logs = await db.getItemsByDate(
          dbName,
          collectionName,
          request.params.searchParams.get('date'),
        );
        response.send([...logs]);
      }
    }
    if (request.params.pathname == '/logs' && request.method == 'GET') {
      if (db) {
        const logs = await db.getAllItems(dbName, collectionName);
        response.send([...logs]);
      }
    }
    if (request.method === 'OPTIONS') {
      // Возвращаем пустой успешный ответ для предварительного запроса OPTIONS
      response.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });
      response.end();
      return;
    }
    if (
      request.params.pathname == '/logs/remove' &&
      request.method == 'DELETE'
    ) {
      const deleteType = request.params.searchParams.get('type');
      console.log(deleteType);
      if (deleteType == 'single') {
        const result = await db.removeSingleItemByDate(
          dbName,
          collectionName,
          request.params.searchParams.get('date'),
        );
        response.send(result);
      } else if (deleteType == 'range') {
        const result = await db.removeManyItemsByDate(
          dbName,
          collectionName,
          request.params.searchParams.get('date'),
          request.params.searchParams.get('endDate'),
        );
        response.send(result);
      }
    }
    if (request.params.pathname == '/logs/test' && request.method == 'POST') {
      if (db) {
        store.addLog('Test Log');

        response.send({ message: 'Test log added' });
      }
    }
  };
};
