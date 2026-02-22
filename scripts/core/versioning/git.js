const { execSync } = require('child_process'); 
const semver = require('semver');

export async function getCommits() {
  const raw = execSync('git log --pretty=format:%H:::%s', { encoding: 'utf-8' })

  return raw
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [hash, message] = line.split(':::')
      return { hash, message }
    })
}

export async function getCurrentVersion() {
  try {
    const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim()
    return semver.valid(tag.replace(/^v/, '')) || '0.0.0'
  } catch {
    return '0.0.0'
  }
}