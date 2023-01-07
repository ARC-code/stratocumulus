const nodeColorCSS = require('./nodeColorCSS')
const nodeSize = require('./nodeSize')

const buildDataAttrs = (attrs) => {
  // Build string for element data attributes
  //
  let dataAttrs = ''
  for (const a in attrs) {
    dataAttrs += ` data-${a}="${attrs[a]}"`
  }

  return dataAttrs
}

const buildNodeStyle = (attrs) => {
  const style = nodeColorCSS(attrs.color)
  return style.trim()
}

const buildNodeElement = (id, attrs) => {
  const nodeStyle = buildNodeStyle(attrs)
  const dataAttrs = buildDataAttrs(attrs)
  return `<div id="${id}-node" class="node" style="${nodeStyle}"` +
    dataAttrs + '></div>'
}

const buildLabelStyle = (attrs) => {
  const size = nodeSize(attrs)
  const style = `
    font-size: ${size / 3}px;
    margin-top: ${size / 6}px;
    margin-left: ${size / 2}px;
  `
  return style.trim()
}

const buildLabelElement = (id, attrs) => {
  const labelStyle = buildLabelStyle(attrs)
  const labelCount = `<div style="float: right; font-size: 50%;">${attrs.value.toLocaleString("en-US")}</div>`
  return `<span id="${id}-label" class="label" ` +
    `style="${labelStyle}">${attrs.label}${('facet_param' in attrs) ? labelCount : ''}</span>`
}

module.exports = (id, attrs) => {
  const nodeEl = buildNodeElement(id, attrs)
  const labelEl = buildLabelElement(id, attrs)

  return nodeEl + '\n' + labelEl
}
