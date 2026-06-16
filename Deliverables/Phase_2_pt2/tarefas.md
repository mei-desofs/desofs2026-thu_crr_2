# DESOFS 2026

# Phase 2: Sprint 2 - Tarefas

# *AVISO: NÃO ESQUECER DE CRIAR BRANCHS E PRS PARA CADA TASK!!*

## 🔧 Development (35%)

| # | Tarefa                                                                                                                  | Responsável             | Status      |
|---|-------------------------------------------------------------------------------------------------------------------------|-------------------------|-------------|
| D1 | Implementar/rever mecanismos de **logging** (requests, erros, eventos de segurança)                                     | Diogo                   | Em processo |
| D2 | Rever **autorização** - garantir que roles e permissões estão corretamente aplicadas em todos os endpoints (backend)    | joao /mateus            | Concluido   |
| D3 | Rever **rotas protegidas** - confirmar que nenhuma rota sensível está acessível sem autenticação/autorização (frontend) | Mateus /joao            | Concluido   |
| D4 | Rever outros pontos de segurança no desenvolvimento **(ver slides das teóricas)**                                       | (joao,wbgtests)Pendente | Pendente    |
| D5 | Schemas - validação de dados em endpoints e operações                                                                   | ?                       | Por começar |


verificar se com o deploy do backend há alguma mitigation que precisa ser implementada
---

## 🏗️ Build and Test (35%)

| # | Tarefa                                                               | Responsável     | Status |
|---|----------------------------------------------------------------------|-----------------|-------|
| B1 | Aprimorar **pipeline** CI/CD - melhorar automatização, caso possível | Mateus | Feito |

---

## 🚀 Production (5%)

| # | Tarefa | Responsável | Status |
|---|--------|--------|--------|
| P1 | Garantir **logging em produção** (ex: integração com Render ou outro serviço) | Diogo | Feito |
| P2 | Configurar **auto deploy** (ex: deploy automático via pipeline no Render) | Diogo | Feito |
| P3 | Documentar **configuration management** (variáveis de ambiente, secrets, etc.) | João T | Em processo |
| P4 | Avaliar **patch management** - atualização de dependências/componentes vulneráveis | João T | Em processo |

---

## 🔍 Operate (5%)

| # | Tarefa | Responsável | Status |
|---|--------|-------------|--------|
| O1 | Implementar/documentar estratégia de **backups** | Mateus      | Por começar |
| O2 | **Vulnerability management** - rever componentes com vulnerabilidades conhecidas (SCA) | joao        | Por começar |

---

## ✅ ASVS (15%)

| # | Tarefa | Responsável | Status |
|---|--------|--------|--------|
| A1 | Atualizar checklist ASVS com base nas entregas anteriores (continuidade da entrega 1 e 2) | Todos | Por começar  |
| A2 | Garantir rastreabilidade entre requisitos de segurança e testes realizados | Todos | Por começar  |

---
