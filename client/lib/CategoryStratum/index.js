require('./style.css')
const Stratum = require('../Stratum')
const io = require('../io')

const CategoryStratum = function (context) {
  // @CategoryStratum
  //
  // A tree graph laid on a plane.
  // The stratum is not yet added to the document.
  // Append stratum.space to a parent space in order to do that.
  //
  // CategoryStratum inherits Stratum
  //
  // Parameters:
  //   context
  //     a Context. The context gives identity to the stratum and
  //     .. defines the faceting and filtering of its content.
  //
  // CategoryStratum emits:
  //   first
  //     when the first node has been loaded and rendered.
  //   final
  //     when all nodes of the stratum have been loaded and rendered.
  //   substratumrequest
  //     when the stratum would like one of its nodes to be opened as
  //     a new stratum.
  //   layout
  //     when the stratum layout changes
  //

  // Inherit
  Stratum.call(this, context)

  // Special element class
  this.space.addClass('category-stratum')

  // Alive when loading or loaded.
  this.alive = false
  // Keep track if still loading.
  this.loading = false

  // Context label element displays information about the filtering context
  this.contextLabel = null

  // Maintain index of facet paths to node keys.
  // Otherwise finding nodes by facet path is very tedious.
  // facetPath -> nodeKey
  this.facetNodeIndex = {}

  // Read-only graph model
  this.graph = io.graphStore.get(this.context)
}

module.exports = CategoryStratum
const proto = CategoryStratum.prototype
proto.isCategoryStratum = true

// Inherit
Object.assign(proto, Stratum.prototype)

// Methods
proto.enableFaceting = require('./enableFaceting')
proto.filter = require('./filter')
proto.getBasisForSubstratum = require('./getBasisForSubstratum')
proto.getFacetNode = require('./getFacetNode')
proto.load = require('./load')
proto.prune = require('./prune')
proto.refreshNodeSizes = require('./refreshNodeSizes')
proto.remove = require('./remove')
proto.render = require('./render')
proto.renderContextLabel = require('./renderContextLabel')
proto.revealLabels = require('./revealLabels')
proto.serveSubstratum = require('./serveSubstratum')
proto.triggerSubstratum = require('./triggerSubstratum')
