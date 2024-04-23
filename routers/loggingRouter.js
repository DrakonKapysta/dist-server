module.exports = function (db = undefined) {
  return async function (request, response) {
    const dbName = 'dest-server';
    const collectionName = 'logs';
    if (request.params.pathname == '/logs' && request.method == 'GET') {
      if (db) {
        const logs = await db.getItemsByDate(
          dbName,
          collectionName,
          request.params.searchParams.get('date') || '2024-01-10',
        );
        response.send({ [collectionName]: logs });
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
        response.send({ [collectionName]: logs });
      }
    }
    if (
      (request.params.pathname == '/logs/remove', request.method == 'DELETE')
    ) {
      response.send({ message: 'GOOD' });
    }
  };
};
