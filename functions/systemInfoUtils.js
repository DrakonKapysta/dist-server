const si = require('systeminformation');

exports.gatherNetworkTrafficData = async function () {
  try {
    const networkStats = await si.networkStats();
    const timestamp = new Date().toISOString(); // Генерация временной метки
    const data = networkStats.map((net) => ({
      interface: net.iface,
      rx: net.rx_sec, // Принятые байты в секунду
      tx: net.tx_sec, // Отправленные байты в секунду
      time: timestamp, // Добавляем временную метку
    }));
    return data;
  } catch (error) {
    console.error('Error gathering network traffic metrics:', error);
  }
};

exports.gatherCpuLoadData = async function () {
  try {
    const cpu = await si.currentLoad();

    const data = {
      cpuLoad: cpu.currentLoad,
    };
    return data;
  } catch (error) {
    console.error('Failed to gather cpu metrics:', error);
    return null;
  }
};
exports.gatherDisksData = async function () {
  try {
    const disks = await si.fsSize();
    const data = {
      diskActivity: disks.map((disk) => ({
        filesystem: disk.fs,
        usage: disk.use,
      })),
    };
    const stats = await si.fsStats();
    data.readSpeed = stats.rx_sec;
    data.writeSpeed = stats.wx_sec;
    return data;
  } catch (error) {
    console.error('Failed to gather disk metrics:', error);
    return null;
  }
};
exports.gatherMemoryData = async function () {
  try {
    const memoryData = await si.mem();
    const memoryLayout = await si.memLayout();

    console.log(
      'Общая память:',
      (memoryData.total / 1024 / 1024 / 1024).toFixed(2),
      'GB',
    );
    console.log(
      'Свободная память:',
      (memoryData.free / 1024 / 1024 / 1024).toFixed(2),
      'GB',
    );
    console.log(
      'Используемая память:',
      (memoryData.used / 1024 / 1024 / 1024).toFixed(2),
      'GB',
    );
    console.log(
      'Кэшированная память:',
      (memoryData.cached / 1024 / 1024 / 1024).toFixed(2),
      'GB',
    );
    console.log(
      'Буферная память:',
      (memoryData.buffers / 1024 / 1024 / 1024).toFixed(2),
      'GB',
    );
    console.log(
      'Активная память:',
      (memoryData.active / 1024 / 1024 / 1024).toFixed(2),
      'GB',
    );
    console.log(
      'Неактивная память:',
      (memoryData.available / 1024 / 1024 / 1024).toFixed(2),
      'GB',
    );
    console.log('Скорость памяти:', memoryLayout[0].clockSpeed, 'MHz');
    console.log('Форм-фактор памяти:', memoryLayout[0].formFactor);
    console.log('Используемые слоты:', memoryLayout.length);

    const data = {
      memoryUsage: (memoryData.used / memoryData.total) * 100, // Процентное использование
      total: (memoryData.total / 1024 / 1024 / 1024).toFixed(2),
      free: (memoryData.free / 1024 / 1024 / 1024).toFixed(2),
      used: (memoryData.used / 1024 / 1024 / 1024).toFixed(2),
      cached: (memoryData.cached / 1024 / 1024 / 1024).toFixed(2),
      buffers: (memoryData.buffers / 1024 / 1024 / 1024).toFixed(2),
      active: (memoryData.active / 1024 / 1024 / 1024).toFixed(2),
      available: (memoryData.available / 1024 / 1024 / 1024).toFixed(2),
      clockSpeed: memoryLayout.map((mem) => mem.clockSpeed),
      fromFactor: memoryLayout.map((mem) => mem.formFactor),
      length: memoryLayout.length,
    };

    return data;
  } catch (error) {
    console.error('Failed to gather memory metrics:', error);
    return null;
  }
};
exports.gatherSystemMetrics = async function () {
  try {
    const cpu = await si.currentLoad();
    const memory = await si.mem();
    const disks = await si.fsSize();
    let network = await si.networkStats();
    console.log(network);
    const timestamp = new Date().toISOString(); // Генерация временной метки
    const data = {
      cpuLoad: cpu.currentLoad,
      memoryUsage: (memory.used / memory.total) * 100, // Процентное использование
      diskActivity: disks.map((disk) => ({
        filesystem: disk.fs,
        usage: disk.use,
      })),
      networkStats: network.map((net) => ({
        interface: net.iface,
        rx: net.rx_sec,
        tx: net.tx_sec,
        time: timestamp, // Добавляем временную метку
      })),
    };

    return data;
  } catch (error) {
    console.error('Failed to gather system metrics:', error);
    return null;
  }
};
