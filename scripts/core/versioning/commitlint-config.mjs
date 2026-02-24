import load from '@commitlint/load';

export async function loadCommitlint() {

  try {
    const loaded = await load({
      cwd: process.cwd()
    })

    return loaded
  } catch {
    // fallback padrão
    const loaded = await load({
      extends: ['@commitlint/config-conventional']
    })

    return loaded
  }
}