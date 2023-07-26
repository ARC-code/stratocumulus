
exports.sizing = {
  maxNodeSize: 100,
  minNodeSize: 10,
  maxValue: 100,
  minValue: 10
}

// Facet parameters are Corpora-parameters navigable by zooming.
exports.facetParameters = [
  'f_federations.id',
  'f_genres.id',
  'f_disciplines.id'
]

// Filter parameters are Corpora-parameters that do not affect navigation.
exports.filterParameters = [
  'f_title',
  'f_agents.label.raw',
  'q',
  'r_years'
]
