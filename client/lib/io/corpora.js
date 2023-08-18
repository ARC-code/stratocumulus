// This string will now be passed to the client by the backend.
const corporaApiPrefix = window.stratocumulus.corporaApiPrefix
// Use native fetch API
const fetch = window.fetch

exports.fetchArtifact = (id, callback) => {
  // Fetch single artifact from the Corpora API.
  //
  // Parameters:
  //   id
  //     a string, the artifact ID
  //
  const artifactUrl = `${corporaApiPrefix}ArcArtifact/${id}/`

  fetch(artifactUrl)
    .then(response => response.json())
    .then(art => callback(null, art))
    .catch(err => callback(err))
}
