exports.rendering = {
  stratumSize: 2560, // px
  categoryNodeSize: 256, // px
  artifactNodeSize: 512 // px
}

exports.sizing = {
  maxNodeSize: 100,
  minNodeSize: 10,
  maxValue: 100,
  minValue: 10
}

exports.decades = {
  minDecade: 400,
  maxDecade: 2100
}

// Facet parameters are Corpora-parameters navigable by zooming.
// TODO rename as navigationParameters or pathParameters or stratumParameters
exports.facetParameters = [
  'f_federations.id',
  'f_genres.id',
  'f_disciplines.id',
  'page'
]

// Filter parameters are Corpora-parameters that do not affect navigation.
exports.filterParameters = [
  'f_title',
  'f_agents.label.raw',
  'q',
  'r_years'
]

// Artifacts
exports.artifacts = {
  threshold: 100, // min facetable count
  pageSize: 9
}
