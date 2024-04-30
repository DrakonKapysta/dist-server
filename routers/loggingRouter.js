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
          request.params.searchParams.get('date') || '2024-01-10',
        );
        response.send([...logs]);
      }
    }
    if (
      request.params.pathname == '/logs/time-provided' &&
      request.method == 'GET'
    ) {
      if (db) {
        const logs = await db.getItemsByTime(
          dbName,
          collectionName,
          request.params.searchParams.get('time') || '00:00:00',
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
    if (request.params.pathname == '/logs/complex' && request.method == 'GET') {
      if (db) {
        const logs = await db.getItemsByDateAndTime(
          dbName,
          collectionName,
          request.params.searchParams.get('date') || '2024-01-10',
          request.params.searchParams.get('time') || '00:00:00',
        );
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
        const result = await db.removeSingleItemByDateAndTime(
          dbName,
          collectionName,
          request.params.searchParams.get('date') || '2024-01-10',
          request.params.searchParams.get('time') || '00:00:00',
        );
        response.send(result);
      } else if (deleteType == 'range') {
        const result = await db.removeManyItemsByDateAndTime(
          dbName,
          collectionName,
          request.params.searchParams.get('date') || '2024-01-10',
          request.params.searchParams.get('time') || '00:00:00',
          request.params.searchParams.get('endDate') || '2024-01-10',
          request.params.searchParams.get('endTime') || '00:00:00',
        );
        response.send(result);
      }
    }
  };
};
