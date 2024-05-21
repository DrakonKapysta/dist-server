module.exports = function calculateWeight(
  coreCount,
  baseCpuPerformance,
  ramAvailable,
) {
  const alpha = 1.0; // coefs
  const beta = 2.0;
  const gamma = 0.5;
  console.log(
    `${alpha} * ${baseCpuPerformance} + ${beta} * ${coreCount} + ${gamma} * ${ramAvailable}`,
  );
  const rawWeight =
    alpha * baseCpuPerformance + beta * coreCount + gamma * ramAvailable;
  return Math.round(rawWeight);
};
