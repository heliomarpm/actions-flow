# Copilot Project Instructions

## Papel
Você está auxiliando no desenvolvimento de uma plataforma de fluxo de trabalho de engenharia reutilizável. O repositório é orientado à arquitetura, não às funcionalidades.

Sempre priorize clareza, determinismo e estabilidade em vez de engenhosidade.

---

## Regras de Arquitetura

1. Nunca misture política e execução
  - shared/ define regras
  - plugins/ executa comandos

2. As entradas do fluxo de trabalho são APIs públicas
  - Não renomeie entradas
  - Não altere o comportamento padrão silenciosamente
  - Sugira a descontinuação em vez da remoção

3. Somente comportamento determinístico
  - Sem lógica dependente do ambiente
  - Sem ordenação aleatória
  - Sempre registre as decisões

4. Prefira logs explícitos a comportamentos implícitos
  - Se o sistema detectar algo, imprima-o
  - Se uma regra for aplicada, explique o motivo

5. Evite o crescimento da configuração
  - Rejeite novas entradas se o comportamento puder ser inferido com segurança
  - Prefira convenções

---

## Diretrizes para Scripts Shell

- Use sintaxe compatível com POSIX sempre que possível
- Falhe rapidamente em erros críticos
- Forneça mensagens de erro legíveis
- Nunca silencie falhas, a menos que explicitamente permitido pelo modo
- Todo script deve ser idempotente

---

## Regras para Plugins

Os plugins devem:
- executar testes
- produzir Cobertura
- Publicar artefatos

Plugins NÃO devem:
- Validar commits
- Interpretar branches
- Decidir versões
- Bloquear pipelines

---

## Diretrizes de Fluxo de Trabalho

Cada fluxo de trabalho tem uma única responsabilidade:
- Validação de qualidade
- Promoção de pull requests
- Liberação de versões
- Distribuição de publicações

Não acople responsabilidades entre fluxos de trabalho.

---

## Política de Mudanças

Mudança de comportamento → documentar no ADR
Mudança de entrada → mudança que quebra a compatibilidade
Mudança de padrão → mudança que quebra a compatibilidade, a menos que seja comprovadamente segura

---

## Mentalidade de Programação

Escreva código para o futuro mantenedor que se esqueceu das decisões de design.

Prefira soluções simples e fáceis de entender.

## Template para ADR

```md
# ADR-XXX — Título da decisão

Status: Proposed
Data: YYYY-MM-DD

---

## Contexto

Descreva:

* Qual problema estamos resolvendo
* Quais restrições existem
* Quais alternativas foram consideradas
* Por que a decisão é necessária agora

Evite soluções aqui. Apenas contexto e pressão arquitetural.

---

## Decisão

Descreva objetivamente:

* O que foi decidido
* Qual abordagem será adotada
* O que explicitamente NÃO será feito

A decisão deve ser clara o suficiente para não gerar múltiplas interpretações.

---

## Consequências

### Positivas

* Benefícios esperados
* Ganhos estruturais

### Negativas

* Custos técnicos
* Complexidade adicional

### Riscos aceitos

* Trade-offs assumidos conscientemente

---

## Alternativas consideradas (opcional)

Liste abordagens descartadas e por que não foram escolhidas.

---

## Critérios de revisão futura

Defina condições que justificariam revisar ou substituir esta decisão.

Exemplos:

* Mudança significativa de escala
* Mudança de stack
* Nova exigência regulatória
* Evidência empírica de falha estrutural

---

## Observações finais

* ADRs não devem ser editados após Accepted
* Mudança de direção exige novo ADR
* Decisões arquiteturais são parte do produto
```