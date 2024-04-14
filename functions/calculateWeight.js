module.exports = function calculateWeight(systemInfo) {
  let weight = Math.round(systemInfo.cores / 4);
  console.log('Sys:cores ' + systemInfo.cores);
  if (weight < 1) weight = 1;
  if (systemInfo.memory >= 2400 && systemInfo.memory < 3600) {
    weight += 1;
  }
  if (systemInfo.memory >= 3600) {
    weight += 2;
  }
  console.log('weight: ' + weight);
  return weight;
};
