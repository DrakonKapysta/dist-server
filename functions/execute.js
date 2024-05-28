module.exports = async function execute(balancer) {
  await balancer.WRR();

  setTimeout(() => {
    execute(balancer);
  }, 1000);
};
