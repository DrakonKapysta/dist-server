module.exports = async function execute(balancer) {
  //console.log(balancer);
  console.log('Set timeout start');
  await balancer.WRR();
  // for (let worker of balancer.workers) {
  //   for (let task of worker.taskQueue) {
  //     console.log(task);
  //   }
  //   console.log();
  //   console.log('===============================================');
  //   console.log();
  // }
  console.log('Set timeout end');
  if (balancer.workers[0].taskQueue.length > 100) return;
  setTimeout(() => {
    execute(balancer);
  }, 0);
};
