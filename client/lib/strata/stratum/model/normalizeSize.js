const sizing = require('../../../config').sizing;

module.exports = (s) => {
  if (s < sizing.minValue) { sizing.minValue = s; }
  if (s > sizing.maxValue) { sizing.maxValue = s; }

  const mx = (s - sizing.minValue) / (sizing.maxValue - sizing.minValue);
  const preshiftNorm = mx * (sizing.maxNodeSize - sizing.minNodeSize);
  return parseInt(preshiftNorm + sizing.minNodeSize);
};
