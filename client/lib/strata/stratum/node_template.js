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

const build_node_element = (id, attrs) => {
  const node_style = build_node_style(attrs);
  const data_attrs = build_data_attrs(attrs);
  return `<div id="${id}-node" class="node" style="${node_style}"` +
    data_attrs + '></div>';
};

const build_label_element = (id, attrs) => {
  return `<span id="${id}-label" class="label">${attrs.label}</span>`;
};

module.exports = (id, attrs) => {
  const node_el = build_node_element(id, attrs);
  const label_el = build_label_element(id, attrs);

  return node_el + '\n' + label_el;
};
