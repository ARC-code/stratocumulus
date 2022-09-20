const sizing = require('./config').sizing

module.exports = (s) => {
    if (s < sizing.min_value) { sizing.min_value = s; }
    if (s > sizing.max_value) { sizing.max_value = s; }

    let mx = (s - sizing.min_value) / (sizing.max_value - sizing.min_value);
    let preshiftNorm = mx * (sizing.max_node_size - sizing.min_node_size);
    return parseInt(preshiftNorm + sizing.min_node_size);
}
