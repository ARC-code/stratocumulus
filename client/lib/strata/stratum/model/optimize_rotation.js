const graphologyLayout = require('graphology-layout');

module.exports = function (graph) {
  // Optimize graph layout rotation so that most nodes are visible.
  const rotations = {};
  let rotation_degree = 0;
  let zero_outliers_found = false;

  while (rotation_degree <= 340) {
    const node_coords = graph.mapNodes((node_id, node_attrs) => {
      const x = node_attrs.x + (window.innerWidth / 2);
      const y = node_attrs.y + (window.innerHeight / 2);
      return [x, y];
    });

    // Find if some nodes are outside viewport
    let outliers = 0;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const coord of node_coords) {
      if (coord[0] < 0 || coord[0] > w || coord[1] < 0 || coord[1] > h) {
        outliers += 1;
      }
    }
    rotations[outliers] = rotation_degree;

    if (rotation_degree > 0 || rotation_degree < 340) {
      const opts = { degrees: true, centeredOnZero: true };
      graphologyLayout.rotation.assign(graph, rotation_degree, opts);
    }

    if (outliers === 0) {
      zero_outliers_found = true;
      break;
    } else {
      rotation_degree += 20;
    }
  }

  // If outliers were found, apply the rotation with least outliers
  if (!zero_outliers_found) {
    const fewest_outliers = Math.min(...Object.keys(rotations));
    const best_rotation = rotations[fewest_outliers];
    const degrees_to_rotate = best_rotation + (360 - rotation_degree);

    const opts = { degrees: true };
    graphologyLayout.rotation.assign(graph, degrees_to_rotate, opts);
  }
};
