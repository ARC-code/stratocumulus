module.exports = function (params) {
  // @Stratum:serveSubstratum(params)
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
  // Parameters:
  //   params
  //     an object with properties:
  //       subcontext
  //         a Context
  //       stage
  //         a string
  //
  throw new Error('Subclass must implement the getNodeBySubcontext method.')
}
