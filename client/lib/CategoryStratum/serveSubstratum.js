module.exports = function (params) {
  // @CategoryStratum:serveSubstratum(params)
  //
  // The purspose of serveSubstratum is to orchestrate the content of
  // this stratum so that its look and feel agrees with the loading state of
  // the substratum.
  //
  // Parameters:
  //   params
  //     an object with properties:
  //       subcontext
  //         a Context
  //       stage
  //         a string
  //

  const subcontext = params.subcontext
  const stage = params.stage

  const node = this.getNodeBySubcontext(subcontext)

  if (!node) {
    // Nothing to serve
    return
  }

  if (stage === 'loading') {
    node.makeOpened()
    node.setLoadingAnimation(true)
    return
  }

  if (stage === 'loaded') {
    node.makeOpened()
    node.setLoadingAnimation(false)
    return
  }

  if (stage === 'closing' || stage === 'closed') {
    node.makeClosed()
    node.setLoadingAnimation(false)
    // return
  }
}
