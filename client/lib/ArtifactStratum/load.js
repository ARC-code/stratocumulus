// const io = require('../io')

module.exports = function () {
  // Begin constructing stratum from the back-end.
  // This makes the stratum alive.
  //

  // window.onload = function(event) {
  //   const viewport = document.getElementById('viewport')
  //
  //   // A typical set of search parameters that gets passed to the backend to generate strata,
  //   // plus a sorting directive to ensure we can test thumbnail functionality
  //   const searchParams = {
  //     'f_federations.id': '5f623f2952023c009d73107f',
  //     'q': 'frankenstein',
  //     's_thumbnail_url': 'desc'
  //   }
  //
  //   makeDataPlaneCards(searchParams, viewport)
  // }

  // async function makeDataPlaneCards (searchParams, viewport, page = 1, pageSize = 9) {
  //   const dataPlaneCardEndpoint = `${corporaApiPrefix}ArcArtifact/`
  //   const dataPlaneCardSearch = Object.assign(searchParams, {
  //     'page-size': pageSize,
  //     page: page,
  //     only: 'id'
  //   })
  //   const dataPlaneCardGetParams = new URLSearchParams(dataPlaneCardSearch)
  //
  //   if (!thumbnailsLoaded) {
  //     const federationEndpoint = `${corporaApiPrefix}ArcFederation/`
  //     const federationSearchParams = {
  //       'page-size': 50,
  //       only: 'id,thumbnail'
  //     }
  //     const federationGetParams = new URLSearchParams(federationSearchParams)
  //
  //     const response = await fetch(`${federationEndpoint}?${federationGetParams}`)
  //     const data = await response.json()
  //     if ('records' in data && data.records.length) {
  //       data.records.forEach(fed => {
  //         federationThumbnails[fed.id] = fed.thumbnail
  //       })
  //       thumbnailsLoaded = true
  //     }
  //   }
  //
  //   fetch(`${dataPlaneCardEndpoint}?${dataPlaneCardGetParams}`)
  //     .then(response => response.json())
  //     .then(data => {
  //       if ('records' in data && data.records.length) {
  //         data.records.forEach(record => {
  //           const cardFrame = document.createElement('div')
  //
  //           cardFrame.setAttribute('id', `artifact-card-${record.id}`)
  //           cardFrame.setAttribute('class', 'artifact-card')
  //
  //           // Here we're just appending the div to our viewport element--replace this with Tapspace
  //           // placement
  //           viewport.appendChild(cardFrame)
  //
  //           generateDataPlaneCardContent(record.id, cardFrame)
  //         })
  //       }
  //     })
  //     .catch(error => console.error(error))
  // }
}
