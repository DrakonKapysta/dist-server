const si = require('systeminformation');
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
        getSystemInfoConfig('currentLoad', 'currentLoad'),
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
        // Получаем информацию о CPU
        const cpuLoad = await si.currentLoad();
        console.log(`CPU Load: ${cpuLoad.currentLoad.toFixed(2)}%`);

        // Получаем информацию о памяти
        const memUsage = await si.mem();

        // Получаем информацию о дисках
        const disksIO = await si.fsSize();

        // Получаем информацию о сетевом трафике
        let networkStats = await si.networkStats();

        // Собираем все данные в один объект для использования в приложении
        response.send({
          cpuLoad: cpuLoad.currentLoad.toFixed(2),
          memoryUsage: (memUsage.active / memUsage.total) * 100,
          diskInfo: disksIO.map((disk) => ({
            filesystem: disk.fs,
            used: disk.use,
            size: disk.size,
          })),
          networkStats: networkStats.map((net) => ({
            iface: net.iface,
            rx_sec: net.rx_sec,
            tx_sec: net.tx_sec,
          })),
        });
      } catch (error) {
        console.error('Failed to gather system information:', error);
      }
    }
  };
};
