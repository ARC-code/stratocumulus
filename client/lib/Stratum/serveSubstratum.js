module.exports = function (subcontext, stage) {
  // @Stratum:serveSubstratum(subcontext, stage)
  //
  // A placeholder that ensures subclasses implement the method.
  //
  // The purspose of serveSubstratum is to orchestrate the content of
  // this stratum so that its look and feel agrees with the loading state of
  // the substratum.
  //
  // For example, use this method to visually open a category node when its
  // substratum is loading or loaded.
  //
  throw new Error('Subclass must implement the getNodeBySubcontext method.')
}
