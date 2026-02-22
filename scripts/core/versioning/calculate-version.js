const semver = require('semver');

export function calculateNextVersion(current, type) {
  if (!type || type === 'none') return null
  return semver.inc(current, type)
}