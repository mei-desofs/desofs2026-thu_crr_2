[Voltar ao README](../README.md)

[Próximo ficheiro](threat_modeling.md)

---

## Vista Geral do Sistema

O **BioCantinas** é um sistema de informação web destinado à gestão sustentável de
cantinas escolares e lares de idosos no município de Cinfães. O sistema suporta
processos de planeamento de ementas, gestão de fornecedores e stock, controlo
sanitário e reserva de refeições, promovendo o uso de produtos biológicos e de
produção local.

### Finalidade do sistema

Digitalizar e automatizar os fluxos operacionais das cantinas da rede BioCantinas,
garantindo rastreabilidade dos produtos, controlo de desperdício, segurança sanitária
e transparência nutricional para os utilizadores finais.

### Principais utilizadores e perfis

| Perfil                           | Responsabilidades principais                                                                                              |
|----------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| Network Admin                    | Gestão global da rede, aprovação de candidaturas, quarentena de fornecedores, fecho sanitário de freguesias, KPIs da rede |
| Canteen Manager                  | Gestão da cantina, ativação de quarentenas, visualização de KPIs da cantina                                               |
| Refectory Manager                | Gestão do refeitório, visualização de KPIs do refeitório                                                                  |
| Dietician Team                   | Publicação de ementas, validação nutricional e de alergénios                                                              |
| Stock Manager                    | Gestão de stock, encomendas a fornecedores, notificações de rotura                                                        |
| Supplier                         | Visualização e resposta a encomendas, gestão de produtos disponíveis                                                      |
| Customer (School / Nursing Home) | Consulta de ementas, reserva de refeições, feedback                                                                       |

### Principais operações de negócio

- Candidatura e onboarding de fornecedores (com seleção validada de freguesia)
- Publicação e aprovação de ementas semanais com informação nutricional
- Planeamento de quantidades e geração automática de encomendas
- Reserva e consumo de refeições por clientes
- Quarentena de fornecedores e fecho sanitário de freguesias
- Cálculo e visualização de KPIs (desperdício, percentagem orgânica,
  desempenho por cantina/refeitório/rede)

### Principais componentes da solução

O sistema segue uma **arquitetura em camadas** (Layered Architecture):

- **Frontend** — React + Vite, SPA com routing client-side (React Router)
- **REST API** — Node.js + Express, exposta via HTTP para consumo pelo frontend
- **Backend (camadas internas)**
    - *Frameworks/Drivers Layer* — routing HTTP, configuração Express, driver MySQL
    - *Adapters Layer* — controllers: validação de input, delegação para services
    - *Application Layer* — services: lógica de negócio, coordenação de repositórios
    - *Domain Model Layer* — entidades e regras de negócio core
- **Base de dados** — MySQL, acesso via ORM Sequelize
- **Armazenamento de ficheiros** — documentos PDF submetidos por fornecedores na
  candidatura; relatórios e exportações de KPIs gerados no servidor

### Dados tratados pela aplicação

- Utilizadores, credenciais e perfis de acesso (role-based)
- Fornecedores, produtos, localização (município, freguesia, zona)
- Ementas, refeições, pratos, receitas, ingredientes e informação nutricional
- Reservas, refeições servidas e feedback
- Stock, lotes, encomendas e produtos encomendados
- Planeamentos de produção e linhas de planeamento
- KPIs de desperdício, percentagem orgânica e desempenho operacional
- Documentação de fornecedores (ficheiros PDF)
- Registos de quarentena e fecho sanitário de freguesias

### Interações entre API, base de dados e armazenamento de ficheiros

O frontend comunica exclusivamente com a REST API via HTTP. A API acede à base de
dados através do ORM Sequelize e ao sistema de ficheiros do servidor para operações
de upload, leitura e organização de documentos. Não existe acesso direto do frontend
à base de dados ou ao sistema de ficheiros.

### Utilização prevista de funcionalidades do sistema operativo no servidor

- **Gestão de ficheiros e diretórios**: organização de documentos de fornecedores e
  relatórios em diretórios estruturados por cantina e época letiva
- **Upload e leitura de ficheiros**: receção de PDFs submetidos pelos fornecedores
  no processo de candidatura
- **Geração de ficheiros**: exportação de relatórios de KPIs em formato PDF ou CSV
  a pedido dos gestores
- **Agendamento de tarefas (cron/scheduler)**: geração automática semanal de
  planeamentos de produção e encomendas a fornecedores com base nas ementas
  publicadas e no stock disponível

---

## Modelo de Domínio

O modelo de domínio do BioCantinas organiza-se em seis **aggregates** nucleares,
refletindo os contextos funcionais principais do sistema. As roles ficam definidas
transversalmente e condicionam os fluxos de acesso e as operações sensíveis.

![Domain Model](../assets/domain_model.png)

#### Menu & Meal
Cobre a definição, planeamento e classificação de refeições e ementas.

- **Entidades**: Menu, Meal, Dish, Recipe, Ingredient, Chef, Dietician Team, Canteen,
  Refectory
- **Invariante**: uma ementa só pode ser publicada após validação nutricional pelo
  Dietician Team
- **Operações sensíveis**: publicação de ementa, aprovação de informação nutricional,
  gestão de alergénios

#### Reservation
Cobre a interação dos clientes com o sistema.

- **Entidades**: Customer (School Customer, Nursing Home Staff), Reservation, Served
  Meal, Feedback
- **Invariante**: uma reserva só pode ser criada se existir ementa publicada para a
  data e refeitório selecionados
- **Operações sensíveis**: reserva de refeição, registo de consumo, submissão de
feedback

#### Supplier
Cobre o recrutamento, onboarding e controlo sanitário de fornecedores.

- **Entidades**: Farmer, Application, Supplier, Expected Product, Recruitment Team
- **Invariante**: a seleção de localização (freguesia) é obrigatória e validada contra
  lista oficial; apenas agricultores com candidatura aprovada transitam para Supplier
- **Operações sensíveis**: submissão de candidatura (com upload de documentos PDF),
  aprovação/rejeição pelo Recruitment Team, ativação de quarentena, fecho sanitário
  de freguesia
- **Ficheiros associados**: documentos PDF submetidos na candidatura, organizados em
  diretórios por fornecedor no servidor

#### Stock & Order
Cobre o controlo de inventário e o ciclo de encomendas.

- **Entidades**: Stock Manager, Stock, Product, Batch, Order, Ordered Product
- **Invariante**: encomendas não podem incluir produtos de fornecedores em quarentena
  ou de parishes em fecho sanitário ativo
- **Operações sensíveis**: criação de encomenda, confirmação de entrega, gestão de
  lotes, notificação de rotura de stock

#### Planning
Cobre a previsão de quantidades e o ajuste dinâmico de encomendas.

- **Entidades**: Planning, Lines of Planning
- **Invariante**: o planeamento verifica disponibilidade de stock antes de gerar
  encomendas; as quantidades são ajustadas após cada reserva confirmada
- **Operações sensíveis**: geração automática de planeamento semanal (operação de
  servidor agendada), ajuste de quantidades por reservas

#### KPI & Statistics
Cobre a monitorização operacional e o suporte à decisão.

- **Entidades**: KPI de desperdício, KPI de percentagem orgânica, KPI de
  desempenho por cantina/refeitório/rede
- **Invariante**: o acesso a KPIs é restrito por role — Canteen Manager vê a sua
  cantina, Refectory Manager vê o seu refeitório, Network Admin vê a rede completa
  com filtros por cantina, refeitório e produtor
- **Operações sensíveis**: exportação de relatórios (geração de ficheiro no servidor),
  cálculo de percentagem orgânica por peso

### Roles e condicionamento de fluxos

| Role              | Aggregates acessíveis                | Restrições                           |
|-------------------|--------------------------------------|--------------------------------------|
| Network Admin     | Todos                                | Sem restrição de scope               |
| Canteen Manager   | Menu, Stock, Planning, KPI (cantina) | Scope limitado à sua cantina         |
| Refectory Manager | Reservation, KPI (refeitório)        | Scope limitado ao seu refeitório     |
| Dietician Team    | Menu & Meal                          | Apenas publicação e validação        |
| Stock Manager     | Stock & Order                        | Gestão de stock e encomendas         |
| Supplier          | Order (read), Product                | Apenas os seus produtos e encomendas |
| Customer          | Reservation                          | Apenas reservas próprias             |

### Elementos ligados a ficheiros e operações do servidor

| Elemento                             | Operação                            | Localização                    |
|--------------------------------------|-------------------------------------|--------------------------------|
| Documentos de candidatura (Supplier) | Upload PDF no registo               | `/uploads/suppliers/{id}/`     |
| Relatórios de KPI                    | Geração e download                  | `/reports/{canteen}/{season}/` |
| Planeamento semanal                  | Geração agendada (cron)             | Persistência em base de dados  |
| Exportação de encomendas             | Geração de ficheiro para fornecedor | `/exports/orders/`             |

---

[Voltar ao README](../README.md)

[Próximo ficheiro](threat_modeling.md)