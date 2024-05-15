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
    data.diskActivity.readSpeed = stats.rx_sec;
    data.diskActivity.writeSpeed = stats.wx_sec;
    return data;
  } catch (error) {
    console.error('Failed to gather disk metrics:', error);
    return null;
  }
};
exports.gatherMemoryData = async function () {
  try {
    const memory = await si.mem();

    const data = {
      memoryUsage: (memory.used / memory.total) * 100, // Процентное использование
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
