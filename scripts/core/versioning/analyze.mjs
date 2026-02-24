import { analyzeCommits } from '@semantic-release/commit-analyzer';
import * as parser from 'conventional-commits-parser';

function priority(type) {
  if (type === 'major') return 3
  if (type === 'minor') return 2
  if (type === 'patch') return 1
  return 0
}

export async function analyzeRelease(commits) {

  let highest = null

  for (const commit of commits) {
    
    console.log(commit.message)
    const parsed = parser.sync(commit.message)

    console.log(parsed)
    
    // const type = await analyzeCommits(
    //   { preset: 'conventionalcommits' },
    //   { commits: [parsed] }
    // )
    // const type = await analyzeCommits(
    //   {
    //     releaseRules: [
    //       { breaking: true, release: 'major' },
    //       { type: 'refactor!', release: 'major' },
    //       { type: 'feat!', release: 'major' },
    //       { type: 'feat', release: 'minor' },
    //       { type: 'fix', release: 'patch' },
    //       { type: 'revert', release: 'patch' },
    //       { type: 'perf', release: 'patch' },
    //       { scope: 'no-release', release: false }]
    //   },
    //   { commits }
    // )

    // if (!type) continue
    
    // console.log(highest = maxRelease(highest, type))
    
    // if (!highest || priority(type) > priority(highest)) {
    //   highest = type
    // }
  }

  return {
    hasRelease: highest !== null,
    releaseType: highest ?? 'none',
    breaking: highest === 'major'
  }
}