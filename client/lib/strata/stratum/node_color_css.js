module.exports = function (colors) {
  // Get CSS string for gradient background color.
  return `
    background: -webkit-gradient(linear, left top, left bottom, from(${colors[0]}), to(${colors[1]}));
    background: -webkit-linear-gradient(top, ${colors[0]}, ${colors[1]});
    background: -moz-linear-gradient(top, ${colors[0]}, ${colors[1]});
    background: -ms-linear-gradient(top, ${colors[0]}, ${colors[1]});
    background: -o-linear-gradient(top, ${colors[0]}, ${colors[1]});
  `.trim();
};
