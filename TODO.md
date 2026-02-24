# 📌 Pendências consolidadas do projeto `reusable-actions`

## 1. Renomeação e padronização das Actions (CI/CD)

Decisão tomada: usar prefixos `ci-` e `cd-`, deixando explícito o papel de cada workflow.

| Antigo        | Novo                  |
| ------------- | --------------------- |
| `ci.yml`      | `ci-quality-gate.yml` |
| `auto-pr.yml` | `cd-promotion.yml`    |
| `release.yml` | `cd-release.yml`      |
| `publish.yml` | `cd-publish.yml`      |


✔️ Naming agora comunica intenção \
✔️ CI = qualidade \
✔️ CD = promoção, release, publicação 

---
## 3. Responsabilidade clara de cada Action

### 🧪 `ci-quality-gate.yml`

Responsável **exclusivamente** por **qualidade**:

- Detectar stack
- Executar testes unitários (se existirem)
- Gerar cobertura (quando suportado)
- Normalizar e armazenar artefatos
- Gerar Summary com status e métricas
- ❌ Não promove código
- ❌ Não versiona
- ❌ Não publica

👉 Executa apenas quando:

- Branch começa com `feature/*`
- `hotfix/*` (ver decisão abaixo)

### 🔀 `cd-promotion.yml`

Responsável por **movimentar código entre branches**, nunca por versionar.

Estratégias suportadas (decididas):

1. direct-main (renomear para `to-main`)
`develop → main` somente se semantic-release detectar nova versão

2. release-branch (reonomear para `to-release`)
`develop → release/x.y.z → main` somente se semantic-release detectar nova versão

3. to-main-always (ou sugira um nome melhor) ✅ nova
`develop → main` sempre, mesmo se semantic-release *NÃO* detectar nova versão

📌 Decisão importante para as duas primeiras:

- Se semantic-release NÃO detectar versão → não faz nada
- ❌ Não falha o workflow
- ❌ Não cria PR vazio
- ✔️ Pipeline segue saudável

4. DECISÕES ARQUITETURAIS JÁ FECHADAS

**4.1 Estratégias de promoção (novo modelo)**

Decidimos abandonar nomes genéricos como direct e adotar nomes explícitos e autoexplicativos.

Estratégias finais:

| Estratégia                   | Descrição                                                           |
| ---------------------------- | ------------------------------------------------------------------- |
| `promote-always-to-main`     | Sempre abre PR para `main`, independentemente de nova versão        |
| `promote-on-release`         | Só abre PR para `main` quando semantic-release detectar nova versão |
| `promote-via-release-branch` | Fluxo `develop → release → main`, apenas quando houver nova versão  |


📌 Branches agora são configuráveis:

- `develop_branch`          -> default: `develop`
- `main_branch`             -> default: `main`
- `prefix_release_branch`   -> default: `release-` (Prefixo para branches de release (ex: `release-1.0.0`) 

Nada fica hardcoded em `main` ou `develop`. 

**4.2 Hotfix (decisão crítica)**

Hotfix:

- ❌ ignora gates de versionamento
- ❌ não passa por develop
- ❌ não usa release-branch
- ✔ abre PR direto para main_branch
- ✔ executa testes e quality gates
- ✔ semantic-release roda após merge

📌 Hotfix é um **override de regras**, não uma estratégia nova.

**4.3 Regras de branches**
| Tipo de branch | Comportamento                                                     |
| -------------- | ----------------------------------------------------------------- |
| `feature/*`    | Executa pipeline completo (testes + promoção conforme estratégia) |
| `hotfix/*`     | Pipeline especial (override)                                      |
| qualquer outra | Apenas testes (sem PR automático)                                 |


Isso precisa estar documentado no **README**.

---
## 3. Decisão formal sobre semantic-release

(Isso merece ADR — e você já sinalizou corretamente)

- Nem todo commit gera release → isso é esperado
- Forçar `patch` automaticamente ❌ não será feito
- Semantic-release é a autoridade final de versionamento
- Promoção depende da existência de uma nova versão

👉 Isso elimina:

- PRs inúteis
- Releases falsas
- Poluição da main

---
## 4. Hotfix: decisão arquitetural

✔️ Hotfix NÃO passa por develop
✔️ Hotfix NÃO força patch automaticamente
✔️ Hotfix ignora estratégia de promoção
✔️ Pode:
    - Rodar testes (ci-quality-gate)
    - Ir direto para main ou release/*
    - Semantic-release decide se há versão ou não

👉 Hotfix é **exceção controlada**, não atalho perigoso

---
## 5. Branches e convenções (documentar no README)

- `feature/*`
    - Executa CI completo
    - Pode abrir PR para develop
- Qualquer outra branch:
    - Executa apenas testes
    - ❌ Não promove
    - ❌ Não abre PR automaticamente
- Branches são configuráveis:
    ```yaml
    develop_branch: develop
    main_branch: main
    ```

✔️ Remove suposição rígida de `main`
✔️ Projeto fica reutilizável de verdade

---
## 6. Release (`cd-release.yml`)

Responsável por:

- Criar tag
- Criar GitHub Release
- Atualizar changelog
- Versionar:
    - package.json
    - composer.json
    - .csproj
    - etc.

📌 Só roda quando:

- Existe versão nova detectada
- Promoção já aconteceu

---
## 7. Publish (`cd-publish.yml`)

Responsável por:

- Publicar artefatos:
    - npm
    - GitHub Packages
    - nuget
    - outros no futuro

📌 Usa plugins por stack (`scripts/plugins/*`)
📌 Hoje `node/publish.sh` é stub — pendente de implementação real

---
## 8. Publicação de documentação (ideia aberta)

Ainda não implementado, mas já alinhado conceitualmente:

- GitHub Pages
- Apenas quando:
    - Docs estiverem disponíveis
    - Release existir ou Documentação for alterada

➡️ Fica como pendência futura, não entra agora no escopo de implementação.

---
## 9. PROBLEMAS JÁ IDENTIFICADOS (NÃO RESOLVIDOS)

**9.1 `run-next-version.sh` quebrando**

Problemas confirmados:
- Script mistura logs com stdout
- `awk '{print $5}'` falha quando não há versão
- Retorno vazio gera branch inválida: `release-`
- Exit code ≠ 0 quebra pipelines consumidores

📌 Decisão tomada:

- Script deve:
    - nunca falhar
    - retornar versão ou string vazia
    - logar apenas em stderr

**9.2 Uso incorreto de `shell-helpers.sh`**

Problema:
- Script sendo source em vários steps
- Falhas como: `log: command not found`

📌 Decisão tomada:

- `shell-helpers.sh` será carregado uma única vez
- Uso via:
    - composite action ou
    - step inicial obrigatório
- Nenhum script deve depender implicitamente dele

**9.3 Criação de branch inválida**

Erro real ocorrido:

    fatal: 'release-' is not a valid branch name

Causa:
- semantic-release não detectou versão
- pipeline tentou criar branch mesmo assim

📌 Correção pendente:

- Gate explícito:
```bash
if [[ -z "$NEXT_VERSION" ]]; then
  skip promotion
fi
```

---
## 10. PENDÊNCIAS DE IMPLEMENTAÇÃO (A FAZER)

**10.1 Refatorar `run-next-version.sh`**

✔ separar logs (stderr) de output (stdout)
✔ nunca dar exit ≠ 0
✔ retornar apenas:
    - 1.2.3 ou
    - vazio

**10.2 Implementar engine de decisão de promoção**

Criar uma camada clara de decisão:
```bash
resolve_promotion_action() {
  # retorna:
  # - skip
  # - pr_to_main
  # - pr_to_release
}
```


Ela deve considerar:
- strategy
- branch atual
- hotfix override
- existência de versão

**10.3 Implementar `to-release`**

Nova estratégia:
- roda semantic-release dry-run
- só cria PR se houver versão
- se não houver:
    - workflow termina com sucesso
    - log explícito: “no release detected, skipping promotion”

**10.4 Refatorar criação de PRs**

PRs devem:
- nunca assumir nome de branch
- nunca ser criados com branch inválida
- respeitar `main_branch` e `develop_branch`

**10.5 Documentação (README)**

Adicionar seções claras:
- Estratégias de promoção
- Configuração de branches
- Regras de branch (`feature/*`, `hotfix/*`)
- Comportamento quando **não há release**
- Fluxo de hotfix

**10.6 ADR (Architecture Decision Record)**

Criar pelo menos 1 ADR documentando:
- por que não forçamos patch
- por que hotfix ignora gates de versão
- por que `promote-on-release` existe
- impacto para consumidores


=====================================================
4️⃣ ENTREGÁVEIS ESPERADOS (CHECK FINAL)

Quando tudo estiver pronto, o projeto terá:

✔ pipelines previsíveis
✔ nenhuma branch inválida criada
✔ semantic-release nunca quebra CI
✔ hotfix seguro e rápido
✔ estratégias claras e documentadas
✔ código extensível sem gambiarras

5️⃣ PRÓXIMO PASSO (SÓ COM SEU OK)

Assim que você confirmar, eu sigo nesta ordem:

1️⃣ Corrigir run-next-version.sh
2️⃣ Criar engine de decisão de promoção
3️⃣ Implementar promote-on-release
4️⃣ Ajustar hotfix override
5️⃣ Desenhar fluxo final (Mermaid)
6️⃣ Escrever ADR
7️⃣ Atualizar README

## 10. Pendências técnicas imediatas

Antes de codar qualquer coisa:

- [ ] Criar ADR explicando:
    - Estratégia de promoção
    - Decisão de não forçar patch
    - Papel do semantic-release

- [ ] Atualizar README com:
    - Novos nomes das actions
    - Fluxos CI/CD (padrão mermaid, quando aplicavel)
    - Estratégias de promoção
    - Convenção de branches

- [ ]  Ajustar `shell-helpers.sh` para:
    - Ser carregado uma única vez
    - Não vazar logs no stdout (bug atual)

- [ ] Corrigir bug de branch release- vazia

- [ ] Ajustar run-next-version.sh para:
    - Não quebrar quando não existir versão
    - Não depender de log fora do helper

---
