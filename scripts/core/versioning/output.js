import fs from 'fs'

export async function writeOutput(data, file) {

  const payload = {
    contract: "actions-flow/versioning@1",
    mode: data.mode,

    commit: {
      valid: data.validation.valid,
      errors: data.validation.errors,
      strict_required: data.strict
    },

    analysis: {
      has_release: data.analysis.hasRelease,
      release_type: data.analysis.releaseType,
      breaking: data.analysis.breaking
    },

    version: {
      current: data.version.current,
      next: data.version.next,
      published: data.version.published
    }
  }

  fs.writeFileSync(file, JSON.stringify(payload, null, 2))
}