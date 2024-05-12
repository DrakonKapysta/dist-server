const si = require('systeminformation');
const { gatherSystemMetrics } = require('../functions/systemInfoUtils');
function getSystemInfoConfig(key, confParams) {
  return { usageConfig: { [key]: confParams } };
}

module.exports = function (io) {
  return async function (request, response) {
    if (
      request.params.pathname == '/system/cpu-usage' &&
      request.method == 'GET'
    ) {
      const socketId = request.params.searchParams.get('socketId');
      const worker = io.sockets.sockets.get(socketId);
      worker.emit(
        'system:cpu-usage',
        getSystemInfoConfig('currentLoad', 'currentLoad'), // temp solution.........
        (callbackResponse) => {
          response.send(callbackResponse);
        },
      );
    }
    if (
      request.params.pathname == '/system/server' &&
      request.method == 'GET'
    ) {
      try {
        const data = await gatherSystemMetrics();
        response.send(data);
      } catch (error) {
        console.error('Failed to gather system information:', error);
      }
    }
  };
};
