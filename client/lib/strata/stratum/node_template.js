const node_color_css = require('./node_color_css');
const node_size = require('./node_size');

const build_data_attrs = (attrs) => {
  // Build string for element data attributes
  //
  let data_attrs = '';
  for (const a in attrs) {
    data_attrs += ` data-${a}="${attrs[a]}"`;
  }

  return data_attrs;
};

const build_node_style = (attrs) => {
  const size = node_size(attrs);
  const style = `
    height: ${size}px;
    width: ${size}px;
    ${node_color_css(attrs.color)}
  `;
  return style.trim();
};

module.exports = (id, attrs) => {
  const node_style = build_node_style(attrs);
  const data_attrs = build_data_attrs(attrs);
  const node_el = `<div id="${id}" class="node" style="${node_style}"${data_attrs}></div>`;
  const label_el = `<span id="${id}-label" class="label">${attrs.label}</span>`;

  return `
    ${node_el}
    ${label_el}
  `.trim();
};
