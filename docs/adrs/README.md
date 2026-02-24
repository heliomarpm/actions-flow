# Architecture Decision Records

Este diretório contém as decisões arquiteturais do projeto.

ADRs registram *por que* o sistema funciona de determinada forma.
Eles evitam regressões conceituais e servem como documentação de engenharia de longo prazo.

---

## Como ler

* Leia em ordem numérica
* Cada ADR representa uma decisão independente
* Mudanças de direção devem gerar um novo ADR, nunca editar histórico

---

## Status possíveis

* **Proposed** — decisão em discussão
* **Accepted** — decisão ativa
* **Superseded** — substituída por outra
* **Deprecated** — não deve mais ser seguida

---

## Índice

| ADR     | Título                                                             | Status   |
| ------- | ------------------------------------------------------------------ | -------- |
| [ADR-001](ADR-000.md) | Separação entre Política e Execução                  | Accepted |
| [ADR-002](ADR-002.md) | Workflows são contratos públicos versionados         | Accepted |
| [ADR-003](ADR-003.md) | Plugins são adaptadores de stack                     | Accepted |
| [ADR-004](ADR-004.md) | Versionamento determinístico baseado em histórico    | Accepted |
| [ADR-005](ADR-005.md) | Promoção baseada em níveis de estabilidade de branch | Accepted |
| [ADR-006](ADR-006.md) | Aplicação progressiva de regras                      | Accepted |
| [ADR-007](ADR-007.md) | Explicabilidade obrigatória do pipeline              | Accepted |
| [ADR-008](ADR-008.md) | Convenção acima de configuração                      | Accepted |
| [ADR-009](ADR-009.md) | Execução determinística                              | Accepted |

---

## Como criar um novo ADR

1. Copie um ADR existente
2. Incremente o número
3. Escreva apenas Contexto, Decisão e Consequências
4. Atualize a tabela de índice

ADRs são permanentes. A história de decisões faz parte da arquitetura.
