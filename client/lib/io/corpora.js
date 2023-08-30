// This string will now be passed to the client by the backend.
const corporaApiPrefix = window.stratocumulus.corporaApiPrefix
// Use native fetch API
const fetch = window.fetch
// How many artifacts per fetch
const PAGE_SIZE = require('../config').artifacts.pageSize

// Store thumbnails once fetched.
let federationThumbnails = null

exports.fetchThumbnails = (callback) => {
  // @io.corpora.fetchThumbnails(callback)
  //
  // Fetch federation thumbnails
  //
  // Parameters:
  //   callback
  //     a function (err, thumbnails) where
  //       thumbnails
  //         an object: federation id -> thumbnail URL
  //

  // Use cache if cached.
  if (federationThumbnails) {
    setTimeout(() => {
      return callback(null, federationThumbnails)
    }, 0)

    return
  }

  const fedBaseUrl = `${corporaApiPrefix}ArcFederation/`
  const fedSearchParams = {
    'page-size': 50,
    only: 'id,thumbnail'
  }
  const fedGetParams = new URLSearchParams(fedSearchParams)
  const fedUrl = fedBaseUrl + '?' + fedGetParams.toString()

  fetch(fedUrl)
    .then(response => response.json())
    .then(data => {
      const thumbnails = {}
      if (data.records && data.records.length > 0) {
        data.records.forEach(fed => {
          thumbnails[fed.id] = fed.thumbnail
        })
      }
      // Cache for following calls.
      federationThumbnails = thumbnails
      callback(null, thumbnails)
    })
    .catch(err => callback(err))
}

exports.fetchArtifact = (id, callback) => {
  // @io.corpora.fetchArtifact(id, callback)
  //
  // Fetch single artifact from the Corpora API.
  //
  // Parameters:
  //   id
  //     a string, the artifact ID
  //   callback
  //     a function (err, artifact)
  //
  const artifactUrl = `${corporaApiPrefix}ArcArtifact/${id}/`

  fetch(artifactUrl)
    .then(response => response.json())
    .then(art => callback(null, art))
    .catch(err => callback(err))
}

exports.fetchArtifactPage = (context, callback) => {
  // @io.corpora.fetchArtifactPage(context, callback)
  //
  // Fetch single page of artifacts.
  //
  // Parameters:
  //   context
  //     a Context with 'page' parameter set.
  //   callback
  //     a function (err, page) where
  //       page
  //         an object { pageNumber, artifactIds }
  //
  const pageBaseUrl = `${corporaApiPrefix}ArcArtifact/`
  const pageNumber = context.getValue('page') || 1 // TODO ensure 1 not 0

  // Extend context
  const pageSearchParams = context.toContextObject()
  pageSearchParams.page = pageNumber
  pageSearchParams.only = 'id'
  pageSearchParams['page-size'] = PAGE_SIZE

  const pageGetParams = new URLSearchParams(pageSearchParams)
  const pageUrl = pageBaseUrl + '?' + pageGetParams.toString()

  fetch(pageUrl)
    .then(response => response.json())
    .then(data => {
      let artifactIds = []
      if (data.records && data.records.length > 0) {
        artifactIds = data.records.map(record => record.id)
      }
      callback(null, {
        pageNumber: pageNumber,
        artifactIds: artifactIds
      })
    })
    .catch(err => callback(err))
}
