const template = require('./template.ejs')

// For mapping an agent's role to a legible label
const agentRoleMapping = window.stratocumulus.agentRoleMapping
// Capture a group of parentheses and its contents at the end of a string.
const agentRoleRegex = /(\([^)]*\))$/

// For keeping track of the default thumbnails for artifacts
// based on the federation they belong to.
const federationThumbnails = {}
// let thumbnailsLoaded = false

// Often the referenced thumbnail for an artifact suffers from link rot,
// and often multiple artifacts share the same thumbnail, so let's keep track
// of any bad thumbnails to avoid wasting time trying to load them.
const invalidCardThumbnails = []

// For keeping track of URL's for artifact archives
const archiveUrls = {}

module.exports = function () {
  // @ArtifactNode:render()
  //

  if (!this.artifact) {
    // Not ready for rendering.
    return
  }

  // Shorthand
  const art = this.artifact

  // Preprocess title
  const title = art.title

  // Preprocess thumbnail to { title, url, fallbackUrl }
  let thumbnail = null
  const primaryFederation = art.federations[0].id
  if (primaryFederation in federationThumbnails) {
    const fallbackUrl = federationThumbnails[primaryFederation]

    let thumbnailUrl = fallbackUrl
    if (art.thumbnail_url) {
      const normalizedUrl = art.thumbnail_url.replace('http:', 'https:')

      if (!invalidCardThumbnails.includes(normalizedUrl)) {
        thumbnailUrl = normalizedUrl
      }
    }

    thumbnail = {
      title: art.title,
      url: thumbnailUrl,
      fallbackUrl
    }
  }

  // Preprocess years
  let years = ''
  if (art.years.length === 1) {
    years = art.years[0]
  } else if (art.years.length > 1) {
    years = `${art.years[0]}-${art.years[art.years.length - 1]}`
  }

  // Preprocess agents to array of { role, name }
  const agents = art.agents.map(agent => {
    let name = agent.label
    let role = ''

    const roleMatch = name.match(agentRoleRegex)
    if (roleMatch) {
      let roleCode = roleMatch[1]
      name = name.replace(roleCode, '').trim()
      roleCode = roleCode.replace('(', '').replace(')', '')
      if (roleCode in agentRoleMapping) {
        role = agentRoleMapping[roleCode]
      } else {
        role = roleCode
      }
    }

    return { name, role }
  })

  // Preprocess archive to { url, id, label }
  const archive = {
    label: art.archive.label,
    id: art.archive.id,
    url: archiveUrls[art.archive.id] || ''
  }

  // Preprocess genres and disciplines
  const genres = art.genres
  const disciplines = art.disciplines

  this.element.innerHTML = template({
    thumbnail,
    title,
    years,
    agents,
    archive,
    genres,
    disciplines
  })
}
