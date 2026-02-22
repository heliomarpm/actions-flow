import analyzeCommit from '@semantic-release/commit-analyzer'
import parser from 'conventional-commits-parser'

function priority(type) {
  if (type === 'major') return 3
  if (type === 'minor') return 2
  if (type === 'patch') return 1
  return 0
}

export async function analyzeRelease(commits) {

  let highest = null

  for (const commit of commits) {

    const parsed = parser.sync(commit.message)

    const type = await analyzeCommit(
      { preset: 'conventionalcommits' },
      { commits: [parsed] }
    )

    if (!type) continue

    if (!highest || priority(type) > priority(highest)) {
      highest = type
    }
  }

  return {
    hasRelease: highest !== null,
    releaseType: highest || 'none',
    breaking: highest === 'major'
  }
}