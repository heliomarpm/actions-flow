import { getCommits, getCurrentVersion } from './git.mjs';
import { validateCommits } from './validate.mjs';
import { analyzeRelease } from './analyze.mjs';
import { calculateNextVersion } from './calculate-version.mjs';
import { writeOutput } from './output.mjs';

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
const analysis = {hasRelease: true} //await analyzeRelease(commits)

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
  // analysis,
  version
}, output)

console.log(`mode=${mode}, strict=${strict}`)
console.log("validation", validation)
// console.log("analysis", analysis)
console.log("version", version)
if (strict && !validation.valid) {
  process.exit(1)
}