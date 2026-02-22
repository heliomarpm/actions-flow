import lint from '@commitlint/lint'
import load from '@commitlint/load'

function shouldIgnore(message) {
  return (
    message.startsWith('Merge ') ||
    message.startsWith('Revert "') ||
    message.startsWith('chore(release):') ||
    message.includes('[skip ci]')
  )
}

async function loadCommitlint() {
  try {
    return await load({ cwd: process.cwd() })
  } catch {
    return await load({
      extends: ['@commitlint/config-conventional']
    })
  }
}

export async function validateCommits(commits) {
  const config = await loadCommitlint()
  const errors = []

  for (const commit of commits) {

    if (shouldIgnore(commit.message)) continue

    const result = await lint(
      commit.message,
      config.rules,
      config.parserPreset
    )

    if (!result.valid) {
      errors.push({
        hash: commit.hash,
        message: result.errors.map(e => e.message).join(', '),
        commit: commit.message
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}