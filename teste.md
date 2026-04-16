# Plano da Fase 1 — Threat Modeling

## 1. Objetivo da Fase 1

A Fase 1 terá como resultado um deliverable único, coeso e bem organizado, centrado exclusivamente nas atividades de *Analysis/Requirements* e *Design* previstas no projeto: levantamento e estruturação de requisitos, abuse cases, threat modeling, secure design, secure architecture e security test planning. O trabalho deve produzir documentação suficientemente completa para responder diretamente aos critérios de avaliação da Phase 1: organização, análise, dataflow, identificação e análise de ameaças, risk assessment, mitigations, requirements e security testing.

---

## 2. Estrutura de trabalho da Fase 1

O trabalho será organizado num deliverable principal na pasta *Deliverables* do repositório, com referências claras para todos os artefactos produzidos. O documento principal deve funcionar como ponto de entrada da fase, ligando de forma explícita os vários ficheiros, diagramas, tabelas e matrizes usados na documentação. A checklist ASVS da fase deve ficar igualmente guardada nessa estrutura, dado que os deliverables e a checklist ASVS fazem parte da avaliação.

A organização interna do trabalho segue cinco blocos articulados:

1. *System overview e domain model*

2. *Requisitos e abuse cases*

3. *Data flow diagrams e trust boundaries*

4. *Threat identification, risk assessment e mitigations*

5. *Security requirements, ASVS e security testing planning*


Cada bloco deve alimentar o seguinte, e nenhum artefacto deve ficar isolado do restante deliverable.

---

## 3. Modelação inicial do sistema

A primeira parte do trabalho fixa a compreensão comum do sistema e estabelece a base documental para todo o threat modeling.

### 3.1 System overview

Deve ser produzido um system overview claro e objetivo, com:

- finalidade do sistema;

- principais utilizadores e perfis;

- principais operações de negócio;

- principais componentes da solução;

- dados tratados pela aplicação;

- interações entre API, base de dados e armazenamento de ficheiros;

- utilização prevista de funcionalidades do sistema operativo no servidor.


A descrição do sistema deve já refletir os requisitos obrigatórios do projeto, nomeadamente a existência de aggregates, roles e operações sobre ficheiros/diretórios, porque esses elementos terão impacto direto nos DFDs, nas trust boundaries e nas ameaças relevantes.

### 3.2 Domain model

O domain model deve ficar completo e bem documentado, em alinhamento com a rubrica de Analysis. Devem ser identificados os aggregates nucleares do sistema e as respetivas relações de domínio, invariantes e operações sensíveis.

A modelação base da fase deve considerar, no mínimo:

- *User*;

- *Team*;

- *Match*;


e deve ainda documentar explicitamente os elementos ligados a ficheiros e operações do servidor sempre que façam parte da solução proposta, por exemplo documentação associada a equipas, relatórios, ficheiros de importação/exportação ou diretórios por competição/época.

As roles devem ficar definidas logo nesta fase e refletidas de forma consistente em todos os artefactos. A base mínima de trabalho inclui:

- *System Admin*;

- *League Admin*;

- *Team Manager*;


Podem existir outros atores externos, mas o núcleo da modelação deve centrar-se nestes papéis e na forma como condicionam os fluxos, os acessos e os riscos.

---

## 4. Requisitos da Fase 1

A secção de requisitos deve ficar operacional, separada e rastreável. Nesta fase, os requisitos não são apenas uma lista; são a base para os DFDs, para a análise STRIDE, para as mitigations e para o plano de testes.

### 4.1 Requisitos funcionais

Os requisitos funcionais devem descrever o que o sistema faz. Devem ser redigidos com identificadores próprios e linguagem verificável. O conjunto base deve cobrir, pelo menos:

- autenticação de utilizadores;

- gestão de utilizadores e respetivos perfis;

- gestão de equipas;

- gestão de jogadores, se fizer parte do âmbito funcional do sistema;

- gestão de jogos;

- submissão e atualização de resultados;

- cálculo e consulta de classificação;

- operações de leitura/escrita de ficheiros e organização de diretórios no servidor, quando necessárias ao sistema.


Cada requisito funcional deve indicar o ator principal e os dados envolvidos, para poder ser ligado aos use cases, abuse cases e DFDs.

### 4.2 Requisitos não funcionais

Os requisitos não funcionais devem descrever propriedades e restrições do sistema, sem serem confundidos com requisitos de segurança. Nesta fase, devem ser documentados os que influenciam diretamente o desenho e o threat model, nomeadamente:

- arquitetura baseada em API;

- persistência em base de dados relacional;

- organização do sistema em componentes identificáveis;

- clareza e rastreabilidade documental;

- consistência entre artefactos;

- uso de notação correta nos DFDs;

- organização do repositório e do deliverable principal.


### 4.3 Secure development requirements / security requirements

Os requisitos de segurança devem aparecer como grupo próprio e justificado, em linha com o Project.md e com a rubrica da Phase 1. Devem cobrir explicitamente:

- *authentication & access control*;

- *data security*;

- *communication*;

- *input validation and data handling*;

- *third-party components*;

- *logging and monitoring*.


Cada requisito de segurança deve ter identificador próprio, linguagem verificável e ligação explícita a pelo menos um dos seguintes elementos:

- ameaça identificada;

- abuse case;

- boa prática reconhecida;

- requisito ASVS aplicável;

- necessidade arquitetural do sistema.


Esta secção deve servir de ponte entre o threat modeling e o security testing planning.

---

## 5. Abuse cases

Os abuse cases devem ser tratados como artefacto nuclear da fase, e não como complemento. São necessários para a rubrica de Threat Identification and Analysis e para Security Testing.

Devem ser definidos abuse cases para os fluxos e operações mais sensíveis do sistema, nomeadamente:

- tentativa de aceder a dados de outra equipa;

- alteração não autorizada de resultados;

- elevação de privilégios através da API;

- manipulação de identificadores de recursos;

- submissão de dados maliciosos em inputs;

- abuso de operações de ficheiros no servidor;

- acesso indevido a ficheiros ou diretórios;

- negação de serviço sobre operações críticas;

- ocultação de ações por ausência de registo adequado.


Cada abuse case deve incluir:

- identificador;

- ator malicioso ou misuse actor;

- pré-condições;

- fluxo de abuso;

- ativo afetado;

- impacto esperado;

- mitigations associadas;

- requisitos de segurança relacionados;

- referência aos testes previstos.


---

## 6. Threat modeling

O threat modeling será conduzido com base num processo documental simples e consistente: *decompose the application, **determine and rank threats* e *determine countermeasures and mitigation*. Esta estrutura está alinhada com o processo lecionado na unidade curricular e é suficiente para suportar a produção do deliverable da fase.

### 6.1 Recolha de informação para o threat model

Antes da análise STRIDE, o modelo deve documentar de forma explícita:

- nome e versão do sistema analisado;

- owner do documento;

- participantes;

- revisores;

- external dependencies;

- entry points;

- exit points;

- assets;

- trust levels;

- data flow diagrams.


Esta informação não é acessória; é a base de consistência do resto da fase.

### 6.2 Data Flow Diagrams

Devem ser produzidos, no mínimo:

- *DFD Level 0*

- *DFD Level 1*


e devem ser produzidos *DFDs Level 2* sempre que a complexidade dos fluxos o justificar, em linha com a rubrica.

Os DFDs devem representar corretamente:

- entidades externas;

- processos;

- data stores;

- fluxos de dados;

- trust boundaries;

- relações entre API, base de dados e sistema de ficheiros.


Os fluxos a detalhar com maior prioridade são os que têm mais impacto de segurança:

- autenticação;

- gestão de utilizadores e roles;

- gestão de equipas;

- gestão de jogos e resultados;

- classificação;

- operações de ficheiros/diretórios no servidor.


### 6.3 STRIDE por elemento do DFD

A identificação de ameaças deve ser feita aplicando *STRIDE por elemento do DFD*, de forma sistemática, em vez de produzir uma lista genérica de ameaças. Isto é um requisito central da rubrica.

A matriz de análise deve incluir, no mínimo:

- ID da ameaça;

- elemento do DFD;

- categoria STRIDE;

- descrição da ameaça;

- threat agent;

- attack vector;

- ativo afetado;

- abuse case associado;

- impacto;

- probabilidade;

- risco;

- mitigation;

- requisito de segurança relacionado;

- requisito ASVS relacionado;

- teste planeado relacionado.


O objetivo é que a STRIDE não exista isoladamente, mas como eixo central de rastreabilidade entre os artefactos.

---

## 7. Risk assessment

A priorização de ameaças deve seguir uma metodologia explícita e uniforme para toda a equipa, em linha com a rubrica da Phase 1.

A abordagem de trabalho será baseada em:

- *Impacto*

- *Probabilidade*

- *Risco resultante*


Cada ameaça deve receber uma classificação justificada e comparável com as restantes, permitindo ordenar os riscos e concentrar as mitigations nos casos prioritários.

A tabela de risco deve incluir:

- ameaça;

- ativo;

- exploração possível;

- impacto;

- probabilidade;

- risco total;

- decisão de tratamento;

- owner da mitigation.


Quando útil, podem ser usados elementos qualitativos de apoio à discussão, mas a classificação final da fase deve ser consistente, simples e defensável no deliverable.

---

## 8. Mitigations

As mitigations devem ser escritas de forma específica, clara e exequível, com foco prioritário nas ameaças com risco mais elevado, em conformidade com a rubrica.

Cada mitigation deve:

- responder diretamente a uma ou mais ameaças identificadas;

- ser tecnicamente compatível com a arquitetura proposta;

- poder ser convertida posteriormente em requisito de implementação ou de verificação;

- ser ligada a requisitos de segurança, ASVS e testes planeados.


A redação deve evitar controlos vagos. As medidas devem ser formuladas como decisões de desenho e de proteção do sistema, por exemplo:

- controlos de autenticação;

- regras de autorização por role e por recurso;

- validação e restrição de input;

- proteção de dados em trânsito e em armazenamento;

- restrições sobre ficheiros, paths e diretórios;

- registo de eventos relevantes;

- limitação e controlo de operações críticas da API.


---

## 9. ASVS

A Fase 1 utilizará o *OWASP ASVS v5.0.0* como referência principal, mantendo *Level 2* como baseline. O ASVS é usado nesta fase como *guia para definição de requisitos de segurança, verificação de cobertura arquitetural e preparação da validação, e não como checklist de implementação concluída. A própria OWASP apresenta a versão estável atual como **5.0.0, recomenda identificar os requisitos com a forma versionada v<version>-<id> e descreve o **Level 2* como o nível recomendado para a maioria das aplicações. ([OWASP Foundation](https://owasp.org/www-project-application-security-verification-standard/ "OWASP Application Security Verification Standard (ASVS) | OWASP Foundation"))

A checklist ASVS da fase deve ser preenchida apenas com os controlos aplicáveis ao sistema e relevantes para a documentação da Fase 1. O foco principal deve recair sobre as áreas que suportam diretamente a análise, a arquitetura, os requisitos e o planeamento da validação, nomeadamente:

- arquitetura, desenho e threat modeling;

- autenticação;

- gestão de sessão, quando aplicável à solução proposta;

- controlo de acessos;

- validação, sanitização e encoding;

- criptografia armazenada, quando aplicável;

- error handling e logging;

- proteção de dados;

- comunicação;

- business logic;

- files and resources;

- API and web services;

- configuração. ([OWASP Developer Guide](https://devguide.owasp.org/en/03-requirements/05-asvs/?utm_source=chatgpt.com "ASVS - OWASP Developer Guide"))


A utilização do ASVS nesta fase deve seguir estas regras:

- cada requisito ASVS incluído deve ser marcado como aplicável, não aplicável ou dependente de decisão arquitetural já tomada;

- cada entrada aplicável deve estar ligada, pelo menos, a um requisito de segurança da fase;

- sempre que exista relação direta, a entrada ASVS deve apontar também para ameaças, mitigations e testes planeados;

- os identificadores ASVS devem ser registados em formato versionado, por exemplo v5.0.0-..., para evitar ambiguidades entre versões. ([OWASP Foundation](https://owasp.org/www-project-application-security-verification-standard/ "OWASP Application Security Verification Standard (ASVS) | OWASP Foundation"))


O ASVS deve, assim, funcionar como mecanismo de cobertura e de validação documental da Fase 1, sem desviar o trabalho para atividades de implementação próprias da Phase 2.

---

## 10. Security testing planning

O plano de security testing deve ser definido já na Fase 1, mas como *planeamento de verificação*, não como execução completa de testes. A rubrica pede metodologia de testing, referência a abuse cases, threat modelling review process, completude do ASVS focada na arquitetura e traceability entre requisitos e testes.

O plano deve incluir:

- objetivos de validação;

- tipos de testes a executar em fases seguintes;

- relação entre abuse cases e testes;

- relação entre requisitos de segurança e testes;

- relação entre ASVS e testes;

- critérios de evidência esperada por teste.


Os testes devem ser planeados por categoria, por exemplo:

- autenticação;

- autorização;

- validação de input;

- proteção de dados e comunicação;

- regras de negócio;

- ficheiros e recursos;

- logging e monitorização;

- configuração da aplicação e da API.


Cada teste planeado deve ter identificador próprio e apontar para:

- requisito funcional relevante, quando aplicável;

- requisito de segurança;

- ameaça;

- mitigation;

- item ASVS;

- abuse case, quando existir.


---

## 11. Rastreabilidade entre artefactos

Toda a documentação da Fase 1 deve ser construída com um esquema único de identificadores e com correspondência explícita entre os artefactos. Esta rastreabilidade é parte estrutural do deliverable e deve ficar visível ao longo do documento, não apenas numa tabela isolada.

A ligação mínima entre artefactos deve assegurar o seguinte encadeamento:

- *system overview / domain model* → define componentes, atores, dados e operações;

- *DFDs* → representam os fluxos e trust boundaries desses componentes;

- *STRIDE* → identifica ameaças por elemento dos DFDs;

- *abuse cases* → concretizam cenários de exploração;

- *risk assessment* → prioriza ameaças;

- *mitigations* → tratam os riscos prioritários;

- *security requirements* → formalizam as exigências de proteção;

- *ASVS* → dá enquadramento e cobertura aos requisitos;

- *security testing planning* → prepara a validação futura dos requisitos e mitigations.


Para suportar isto, devem ser usados identificadores consistentes, por exemplo:

- FR-xx para requisitos funcionais;

- NFR-xx para requisitos não funcionais;

- SR-xx para security requirements;

- AC-xx para abuse cases;

- DFD-xx para elementos/diagramas;

- TH-xx para threats;

- RISK-xx para entradas de risco;

- MIT-xx para mitigations;

- TEST-xx para testes planeados;

- ASVS-v5.0.0-... para referências ASVS.


---

## 12. Processo de revisão do threat model

O threat modelling review process será formalizado e executado durante a Fase 1, como parte obrigatória do deliverable.

### 12.1 Revisão cruzada

Cada membro produz o seu artefacto principal, mas nenhum artefacto é fechado sem revisão cruzada por, pelo menos, outro membro do grupo.

A revisão cruzada deve verificar:

- coerência com o system overview e o domain model;

- consistência de nomenclatura e identificadores;

- correspondência entre DFDs e fluxos descritos;

- aplicação correta de STRIDE por elemento;

- ligação entre threats, risks, mitigations e requisitos;

- ligação entre security requirements, ASVS e testing plan.


### 12.2 Validação final integrada

Após a revisão cruzada, é feita uma validação final em grupo, com leitura do deliverable completo e verificação dos critérios mínimos de consistência.

Essa validação final confirma, no mínimo, que:

- existe um documento principal com ligações claras para todos os artefactos;

- os DFDs incluem componentes, fluxos, entidades externas e trust boundaries;

- a STRIDE foi aplicada por elemento do DFD;

- os abuse cases estão refletidos no threat model e no testing plan;

- os riscos estão priorizados com metodologia consistente;

- as mitigations respondem às ameaças de maior prioridade;

- os requisitos de segurança estão separados dos requisitos funcionais e não funcionais;

- a checklist ASVS está preenchida com foco arquitetural e com referências válidas;

- os testes planeados estão ligados aos requisitos de segurança;

- o deliverable permanece estritamente focado na Fase 1.


### 12.3 Critérios mínimos de fecho

Um artefacto só é considerado fechado quando:

- está completo na sua secção;
- foi revisto por outro membro;
- está ligado aos identificadores dos artefactos relacionados;
- não contradiz decisões documentadas noutro ponto do deliverable.

---

## 13. Distribuição do trabalho pelos 4 membros

A distribuição passa a ser feita *com base direta na rubrica da Fase 1, ignorando apenas **Organization and Language (5%), como definido. Assim, a carga relevante para distribuição entre os membros corresponde a **95%* do peso total da fase.

Como esses *95%* não dividem exatamente por 4, a distribuição interna é feita por *equilíbrio prático, ficando cada membro com uma carga-alvo de **23,75% da carga útil da fase. Para facilitar a leitura do grupo, essa carga corresponde aproximadamente a **25% da distribuição interna*.

A *base documental comum inicial* mantém-se fora da atribuição individual, não sendo imputada a nenhum membro em particular:

- *3.1 System overview*
- *3.2 Domain model*
- estrutura base de *11. Rastreabilidade entre artefactos*

---

### Membro 1 — Requisitos funcionais, não funcionais e abuse cases

*Carga atribuída:* *23,75% da carga útil da fase* (≈ 25% da distribuição interna)

*Tópicos atribuídos:*

- *4.1 Requisitos funcionais*
- *4.2 Requisitos não funcionais*
- *5. Abuse cases*

*Relação com a rubrica:*

- *Analysis — 10%*

    - pela estruturação funcional do sistema, descrição operacional dos fluxos e apoio direto à compreensão dos componentes e comportamento do sistema;
- *Threat Identification and Analysis — 8,75%*

    - pela definição dos abuse cases, misuse actors, attack vectors e cenários de exploração ligados aos fluxos do sistema;
- *Security Testing — 5%*
    - pela ligação entre abuse cases e os cenários de teste a planear posteriormente.

*Responsabilidades principais:*

- redigir os requisitos funcionais com identificadores claros;
- redigir os requisitos não funcionais relevantes para desenho e consistência documental;
- construir os abuse cases principais;
- garantir que os abuse cases estão alinhados com os fluxos funcionais do sistema.

*Entregáveis principais:*

- catálogo de requisitos funcionais;
- catálogo de requisitos não funcionais;
- catálogo de abuse cases.

---

### Membro 2 — Security requirements, ASVS e rastreabilidade de validação

*Carga atribuída:* *23,75% da carga útil da fase* (≈ 25% da distribuição interna)

*Tópicos atribuídos:*

- *4.3 Secure development requirements / security requirements*
- *9. ASVS*
- *11. Rastreabilidade entre artefactos* (com foco em requisitos, ASVS e testes)

*Relação com a rubrica:*

- *Requirements — 20%*
    - pela definição e estruturação dos security requirements exigidos pela fase;
- *Security Testing — 3,75%*
    - pela parte de traceability entre requisitos documentados, ASVS e testes planeados.

*Responsabilidades principais:*

- redigir os requisitos de segurança com separação explícita face aos requisitos funcionais e não funcionais;
- preencher e organizar a checklist ASVS;
- mapear security requirements para ASVS;
- assegurar a ligação entre security requirements, ASVS e validation planning.

*Entregáveis principais:*

- catálogo de security requirements;
- checklist ASVS da Fase 1;
- secção de rastreabilidade entre requisitos, ASVS e testes.

---

### Membro 3 — Recolha de informação para o threat model, DFDs e risk assessment

*Carga atribuída:* *23,75% da carga útil da fase* (≈ 25% da distribuição interna)

*Tópicos atribuídos:*

- *6.1 Recolha de informação para o threat model*
- *6.2 Data Flow Diagrams*
- *7. Risk assessment*

*Relação com a rubrica:*

- *Dataflow — 15%*
    - pela produção dos DFDs, trust boundaries, external entities, componentes e fluxos de dados;

- *Risk Assessment — 8,75%*
    - pela aplicação da metodologia de priorização de risco e sua justificação.


*Responsabilidades principais:*

- identificar entry points, exit points, assets, trust levels e external dependencies;
- produzir o *DFD Level 0*;
- produzir o *DFD Level 1*;
- produzir *DFDs Level 2* quando necessário;
- estruturar e documentar a metodologia de risk assessment;
- classificar riscos de forma consistente com a matriz definida pelo grupo.

*Entregáveis principais:*

- tabela de elementos base do threat model;
- conjunto de DFDs;
- mapa de trust boundaries;
- tabela de risk assessment.

---

### Membro 4 — STRIDE, mitigations, testing methodology e review process

*Carga atribuída:* *23,75% da carga útil da fase* (≈ 25% da distribuição interna)

*Tópicos atribuídos:*

- *6.3 STRIDE por elemento do DFD*
- *8. Mitigations*
- *10. Security testing planning*
- *12. Processo de revisão do threat model*

*Relação com a rubrica:*

- *Threat Identification and Analysis — 11,25%*

    - pela aplicação da STRIDE por elemento do DFD e pela consolidação da análise de ameaças;

- *Mitigations — 10%*

    - pela definição das mitigations específicas e viáveis;

- *Security Testing — 2,5%*

    - pela metodologia de security testing e pela formalização do threat modelling review process.


*Responsabilidades principais:*

- aplicar STRIDE por elemento do DFD;
- consolidar a matriz de ameaças;
- definir mitigations ligadas aos riscos prioritários;
- estruturar a metodologia de security testing;
- formalizar o processo de revisão cruzada e validação final do threat model.

*Entregáveis principais:*

- matriz STRIDE por elemento do DFD;
- catálogo de mitigations;
- secção de security testing planning;
- secção do review process.

---

### Integração

A integração entre os membros mantém checkpoints claros, agora alinhados com esta distribuição por peso da rubrica:

- após fecho da *base documental comum inicial* (*3.1, **3.2* e estrutura base de *11*);
- após primeira versão de *4.1, **4.2* e *5*;
- após primeira versão de *4.3, **9* e parte correspondente de *11*;
- após fecho de *6.1, **6.2* e primeira versão de *7*;
- após primeira versão de *6.3, **8, **10* e *12*;
- antes da validação final integrada do deliverable.

Desta forma, a distribuição fica organizada por tópicos já definidos no plano, mantém o *tópico 3* como base comum fora da atribuição individual e reparte a carga com referência direta aos pesos da rubrica da Fase 1.