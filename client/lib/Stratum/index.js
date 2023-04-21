const stratumModel = require('./model')
const stratumView = require('./view')
const emitter = require('component-emitter')

const Stratum = function (path, context, label, bgColor) {
  // A tree graph laid on a plane.
  // The stratum is not yet added to the document.
  // Append stratum.space to a parent space in order to do that.
  //
  // Stratum inherits Emitter
  //
  // Parameters:
  //   path
  //     string, the stratum id
  //   context
  //     object, tells where the user came from.
  //   label
  //     string
  //   bgColor
  //     string, css color
  //
  // Stratum emits:
  //   first
  //     when the first node has been loaded and rendered.
  //   final
  //     when all subgraphs of the stratum has been loaded and rendered.
  //   stratumrequest
  //     when the stratum would like one of its nodes to be opened as
  //     a new stratum.
  //

  // Build valid html-friendly id
  const divId = path.replaceAll('/', 'X')
  // Create container for the stratum
  const stratumSpace = stratumView.createGraphSpace(divId)

  // space element id
  this.id = divId
  // stratum identifier: path
  this.path = path
  // space component
  this.space = stratumSpace
  // graph model
  this.graph = stratumModel.createGraph()
  //
  this.layout = null
  //
  this.label = label
  //
  this.imageSrc = null
  // Initial node color?
  this.bgColor = bgColor
  // Navigation context
  this.context = Object.assign({}, context)
  // Alive when loading or loaded.
  this.alive = false
  // Keep track if still loading
  this.loading = false
}

module.exports = Stratum
const proto = Stratum.prototype

// Inherit
emitter(proto)

// Methods
proto.emphasizeDecades = require('./emphasizeDecades')
proto.filterByKeyword = require('./filterByKeyword')
proto.load = require('./load')
proto.getSpace = require('./getSpace')
proto.refresh = require('./refresh')
proto.remove = require('./remove')
