import semver from 'semver';

export function calculateNextVersion(current, type) {
  console.log("calculateNextVersion");
  if (!type || type === 'none') return null
  return semver.inc(current, type)
}