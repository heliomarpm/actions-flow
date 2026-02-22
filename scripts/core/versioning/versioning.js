import { getCommits, getCurrentVersion } from './git.js'
import { validateCommits } from './validate.js'
import { analyzeRelease } from './analyze.js'
import { calculateNextVersion } from './calculate-version.js'
import { writeOutput } from './output.js'

function parseArgs() {
  const args = {}
  for (const arg of process.argv.slice(2)) {
    const [k, v] = arg.split('=')
    args[k.replace(/^--/, '')] = v
  }
  return args
}

const args = parseArgs()

const mode = args.mode || 'validate'
const strict = args.strict === 'true'
const output = args.output

const commits = await getCommits()
const currentVersion = await getCurrentVersion()

const validation = await validateCommits(commits)
const analysis = await analyzeRelease(commits)

let version = {
  current: currentVersion,
  next: null,
  published: null
}

if (analysis.hasRelease && mode !== 'validate') {
  version.next = calculateNextVersion(currentVersion, analysis.releaseType)
}

if (mode === 'publish' && version.next) {
  version.published = version.next
}

await writeOutput({
  mode,
  strict,
  validation,
  analysis,
  version
}, output)

if (strict && !validation.valid) {
  process.exit(1)
}