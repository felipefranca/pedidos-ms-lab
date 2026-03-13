# Roteiro de Leitura por Arquivo - `pedidos-ms`

Este documento e a sua trilha pratica de leitura do codigo.

A ideia aqui e simples: em vez de abrir os arquivos aleatoriamente, voce vai estudar em uma ordem que faz o sistema ficar claro mais rapido.

Regra de Pareto aplicada:

- primeiro os arquivos que explicam o fluxo principal
- depois os arquivos que explicam a arquitetura
- por ultimo os arquivos de infraestrutura, operacao e maturidade

Use este roteiro com o guia principal:

- [`C:\code_environment\workspace\pedidos-ms\docs\GUIA_ESTUDO_COMPLETO.md`](C:\code_environment\workspace\pedidos-ms\docs\GUIA_ESTUDO_COMPLETO.md)

---

## 1. Como usar este roteiro

Para cada arquivo, faca sempre estas 4 perguntas:

1. Esse arquivo recebe uma entrada, transforma dados ou so configura algo?
2. Em que ponto do fluxo ele participa?
3. Quais dependencias ele chama?
4. O que quebraria se esse arquivo nao existisse?

Se voce estudar com essas perguntas, seu entendimento sobe muito.

---

## 2. Fase 1: Entenda o produto antes da infraestrutura

Objetivo: entender o que o sistema faz na pratica.

### 2.1 Tela inicial do frontend

Leia:

- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\page.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\app\page.tsx)

O que observar:

- qual e a proposta da aplicacao
- quais caminhos de navegacao existem
- como o projeto apresenta login, cadastro e dashboard

O que aprender:

- a aplicacao e um sistema de pedidos com autenticacao
- o frontend e a porta de entrada do usuario

### 2.2 Tela de login

Leia:

- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\login\page.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\app\login\page.tsx)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\components\auth-form.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\components\auth-form.tsx)

O que observar:

- como o formulario captura email e senha
- como o submit acontece
- como mensagens de erro e sucesso sao tratadas

O que aprender:

- fluxo basico de formulario no React
- separacao entre pagina e componente reutilizavel

### 2.3 Cadastro

Leia:

- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\register\page.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\app\register\page.tsx)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\components\auth-form.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\components\auth-form.tsx)

O que observar:

- como o mesmo componente pode servir para fluxos diferentes
- o que muda entre login e cadastro

O que aprender:

- reutilizacao de UI
- padrao de composicao simples em React

### 2.4 Dashboard

Leia:

- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\dashboard\page.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\app\dashboard\page.tsx)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\components\dashboard-client.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\components\dashboard-client.tsx)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\components\logout-button.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\components\logout-button.tsx)

O que observar:

- o que e carregado no servidor e o que roda no cliente
- como pedidos sao exibidos
- como um novo pedido e enviado
- como logout limpa sessao

O que aprender:

- diferenca entre Server Component e Client Component
- fluxo de leitura e escrita na interface
- organizacao de estado em uma tela real

---

## 3. Fase 2: Entenda o BFF do Next.js

Objetivo: entender como o frontend conversa com o backend sem expor demais a autenticacao no browser.

### 3.1 Login via route handler

Leia:

- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\login\route.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\login\route.ts)

O que observar:

- a rota recebe credenciais do browser
- ela chama o gateway real
- ela grava token em cookie HTTP-only

O que aprender:

- BFF significa Backend for Frontend
- essa camada protege melhor detalhes de autenticacao
- o browser nao precisa gerenciar token cru em `localStorage`

### 3.2 Cadastro via route handler

Leia:

- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\register\route.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\register\route.ts)

O que observar:

- validacao basica
- proxy para o backend
- normalizacao da resposta

### 3.3 Sessao do usuario

Leia:

- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\me\route.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\me\route.ts)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\logout\route.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\logout\route.ts)

O que observar:

- leitura de cookie
- invalidacao de sessao local no frontend

O que aprender:

- sessao no frontend moderno nao significa necessariamente sessao no servidor tradicional
- cookie HTTP-only pode guardar o token e reduzir exposicao no browser

### 3.4 Pedidos no BFF

Leia:

- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\api\orders\route.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\app\api\orders\route.ts)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\api\orders\[id]\status\route.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\app\api\orders\[id]\status\route.ts)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\lib\backend.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\lib\backend.ts)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\lib\types.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\lib\types.ts)

O que observar:

- como o token e extraido do cookie
- como o frontend monta chamadas para o gateway
- como os tipos ajudam a nao se perder nos contratos

O que aprender:

- organizacao de camada HTTP no front
- importancia de tipos compartilhados internamente
- padrao de encapsular URL, headers e payloads

---

## 4. Fase 3: Entenda o backend pelo fluxo de autenticacao

Objetivo: aprender o caminho completo do login no Spring Boot.

### 4.1 Classe principal do servico

Leia:

- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\AuthServiceApplication.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\AuthServiceApplication.java)

O que observar:

- ponto de entrada do microservico
- bootstrap da aplicacao Spring

### 4.2 Entrada HTTP

Leia:

- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\controller\AuthController.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\controller\AuthController.java)

O que observar:

- endpoints expostos
- DTOs de entrada e saida
- quais metodos chamam o service

O que aprender:

- controller deve ser fino
- regra de negocio nao deveria se espalhar por ele

### 4.3 Regra de negocio

Leia:

- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\service\AuthService.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\service\AuthService.java)

O que observar:

- fluxo de cadastro
- fluxo de login
- onde a senha e codificada
- onde o token e gerado

O que aprender:

- service e o coracao da regra
- autenticacao costuma unir repositorio, encoder e JWT

### 4.4 Modelo de dados

Leia:

- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\domain\AppUser.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\domain\AppUser.java)
- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\repository\UserRepository.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\repository\UserRepository.java)

O que observar:

- mapeamento JPA
- campos da entidade
- consulta por email ou identificador

O que aprender:

- entidade modela dado persistido
- repository simplifica o acesso ao banco

### 4.5 Contratos da API

Leia:

- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\dto\LoginRequest.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\dto\LoginRequest.java)
- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\dto\RegisterRequest.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\dto\RegisterRequest.java)
- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\dto\AuthResponse.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\dto\AuthResponse.java)
- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\dto\UserProfileResponse.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\dto\UserProfileResponse.java)

O que observar:

- o que entra e o que sai da API
- por que nao devolver a entidade direto

### 4.6 Seguranca e JWT

Leia nesta ordem:

- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\config\SecurityConfig.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\config\SecurityConfig.java)
- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\security\JwtService.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\security\JwtService.java)
- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\security\JwtAuthenticationFilter.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\security\JwtAuthenticationFilter.java)
- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\security\CustomUserDetailsService.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\security\CustomUserDetailsService.java)

O que observar:

- endpoints liberados vs protegidos
- como o token e criado
- como o token e validado
- como o usuario autenticado entra no contexto de seguranca

O que aprender:

- `SecurityFilterChain` e o eixo central do Spring Security moderno
- JWT precisa de assinatura, parse e validacao
- seguranca nao mora so no controller

### 4.7 OpenAPI

Leia:

- [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\config\openapi\OpenApiConfig.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\config\openapi\OpenApiConfig.java)

O que aprender:

- como documentar API de forma viva
- por que Swagger ajuda muito em estudo e integracao

---

## 5. Fase 4: Entenda o backend pelo fluxo de pedidos

Objetivo: aprender dominio, persistencia e eventos.

### 5.1 Entrada do servico

Leia:

- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\OrderServiceApplication.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\OrderServiceApplication.java)

### 5.2 Controller de pedidos

Leia:

- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\controller\OrderController.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\controller\OrderController.java)

O que observar:

- endpoints de criacao, listagem e atualizacao
- como usuario autenticado influencia as operacoes

### 5.3 Service de pedidos

Leia:

- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\service\OrderService.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\service\OrderService.java)

O que observar:

- criacao do pedido
- regras de status
- consulta por usuario
- chamada do publisher de eventos

O que aprender:

- aqui mora a maior parte do comportamento de negocio

### 5.4 Dominio e repositorio

Leia:

- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\domain\Order.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\domain\Order.java)
- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\domain\OrderStatus.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\domain\OrderStatus.java)
- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\repository\OrderRepository.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\repository\OrderRepository.java)

O que observar:

- como a entidade representa o pedido
- como o status foi modelado
- como as consultas atendem o fluxo da aplicacao

### 5.5 DTOs

Leia:

- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\dto\CreateOrderRequest.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\dto\CreateOrderRequest.java)
- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\dto\OrderResponse.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\dto\OrderResponse.java)
- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\dto\UpdateOrderStatusRequest.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\dto\UpdateOrderStatusRequest.java)

O que aprender:

- contrato de entrada e saida para operacoes do dominio

### 5.6 Seguranca do servico de pedidos

Leia:

- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\config\SecurityConfig.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\config\SecurityConfig.java)
- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\security\JwtAuthenticationFilter.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\security\JwtAuthenticationFilter.java)
- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\security\AuthenticatedUserProvider.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\security\AuthenticatedUserProvider.java)

O que observar:

- como o servico identifica o usuario logado
- como ele decide quais endpoints exigem token

### 5.7 Eventos Kafka

Leia:

- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\event\OrderEvent.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\event\OrderEvent.java)
- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\event\OrderEventPublisher.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\event\OrderEventPublisher.java)

O que observar:

- qual payload vai para o Kafka
- em que momento do fluxo o evento e disparado

### 5.8 OpenAPI de pedidos

Leia:

- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\config\openapi\OpenApiConfig.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\config\openapi\OpenApiConfig.java)

---

## 6. Fase 5: Entenda mensageria pelo consumidor

Objetivo: ver o outro lado do evento.

Leia nesta ordem:

- [`C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\NotificationServiceApplication.java`](C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\NotificationServiceApplication.java)
- [`C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\config\KafkaConsumerConfig.java`](C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\config\KafkaConsumerConfig.java)
- [`C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\event\OrderEvent.java`](C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\event\OrderEvent.java)
- [`C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\consumer\OrderEventConsumer.java`](C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\consumer\OrderEventConsumer.java)
- [`C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\service\NotificationService.java`](C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\service\NotificationService.java)

O que observar:

- como o consumer recebe mensagens
- como o payload e desserializado
- o que acontece quando um evento chega

O que aprender:

- arquitetura orientada a eventos de forma concreta
- producer e consumer sao partes complementares de um fluxo assincrono

---

## 7. Fase 6: Entenda o gateway e a infraestrutura base

Objetivo: entender por que os microservicos conseguem operar juntos.

### 7.1 API Gateway

Leia:

- [`C:\code_environment\workspace\pedidos-ms\api-gateway\src\main\java\com\playground\gateway\ApiGatewayApplication.java`](C:\code_environment\workspace\pedidos-ms\api-gateway\src\main\java\com\playground\gateway\ApiGatewayApplication.java)
- [`C:\code_environment\workspace\pedidos-ms\config-repo\api-gateway.yml`](C:\code_environment\workspace\pedidos-ms\config-repo\api-gateway.yml)

O que observar:

- rotas por path
- nomes de servico usados no roteamento
- relacao entre gateway e discovery

### 7.2 Discovery Server

Leia:

- [`C:\code_environment\workspace\pedidos-ms\discovery-server\src\main\java\com\playground\discovery\DiscoveryServerApplication.java`](C:\code_environment\workspace\pedidos-ms\discovery-server\src\main\java\com\playground\discovery\DiscoveryServerApplication.java)

O que aprender:

- registro e descoberta de servicos
- por que o gateway e outros servicos nao precisam conhecer IPs fixos

### 7.3 Config Server

Leia:

- [`C:\code_environment\workspace\pedidos-ms\config-server\src\main\java\com\playground\configserver\ConfigServerApplication.java`](C:\code_environment\workspace\pedidos-ms\config-server\src\main\java\com\playground\configserver\ConfigServerApplication.java)
- [`C:\code_environment\workspace\pedidos-ms\config-repo\auth-service.yml`](C:\code_environment\workspace\pedidos-ms\config-repo\auth-service.yml)
- [`C:\code_environment\workspace\pedidos-ms\config-repo\order-service.yml`](C:\code_environment\workspace\pedidos-ms\config-repo\order-service.yml)
- [`C:\code_environment\workspace\pedidos-ms\config-repo\notification-service.yml`](C:\code_environment\workspace\pedidos-ms\config-repo\notification-service.yml)

O que observar:

- configuracao centralizada por servico
- portas, nomes, actuator, kafka e demais propriedades externas ao codigo

O que aprender:

- codigo e configuracao sao responsabilidades diferentes

---

## 8. Fase 7: Entenda como o sistema sobe de verdade

Objetivo: aprender operacao e ambiente.

### 8.1 Docker Compose

Leia primeiro:

- [`C:\code_environment\workspace\pedidos-ms\docker-compose.yml`](C:\code_environment\workspace\pedidos-ms\docker-compose.yml)

O que observar:

- ordem implicita de inicializacao
- `depends_on` com `condition: service_healthy`
- bancos separados
- Kafka e Zookeeper
- frontend separado do backend
- variaveis de ambiente
- portas publicadas

O que aprender:

- esse arquivo e o mapa operacional da plataforma

### 8.2 Script automatizado

Leia:

- [`C:\code_environment\workspace\pedidos-ms\scripts\up-and-test.ps1`](C:\code_environment\workspace\pedidos-ms\scripts\up-and-test.ps1)

O que observar:

- como o ambiente e levantado
- como endpoints sao esperados
- como o fluxo principal e testado automaticamente

O que aprender:

- automacao simples gera muito valor real

---

## 9. Fase 8: Entenda monitoramento e maturidade

### 9.1 Prometheus

Leia:

- [`C:\code_environment\workspace\pedidos-ms\monitoring\prometheus.yml`](C:\code_environment\workspace\pedidos-ms\monitoring\prometheus.yml)

O que observar:

- alvos de scrape
- periodicidade
- relacao com actuator

### 9.2 Grafana

Leia:

- [`C:\code_environment\workspace\pedidos-ms\monitoring\grafana\provisioning\datasources\datasource.yml`](C:\code_environment\workspace\pedidos-ms\monitoring\grafana\provisioning\datasources\datasource.yml)
- [`C:\code_environment\workspace\pedidos-ms\monitoring\grafana\provisioning\dashboards\dashboard.yml`](C:\code_environment\workspace\pedidos-ms\monitoring\grafana\provisioning\dashboards\dashboard.yml)
- [`C:\code_environment\workspace\pedidos-ms\monitoring\grafana\provisioning\dashboards\json\pedidos-ms-dashboard.json`](C:\code_environment\workspace\pedidos-ms\monitoring\grafana\provisioning\dashboards\json\pedidos-ms-dashboard.json)

O que observar:

- datasource
- provisionamento automatico de dashboard
- como as metricas viram visualizacao

### 9.3 CI

Leia:

- [`C:\code_environment\workspace\pedidos-ms\.github\workflows\ci.yml`](C:\code_environment\workspace\pedidos-ms\.github\workflows\ci.yml)

O que observar:

- gatilho de pipeline
- instalacao de dependencias
- etapa de testes
- validacao automatica do monorepo

O que aprender:

- CI e a primeira linha de defesa contra regressao

---

## 10. Ordem curta para revisar tudo em 2 horas

Se voce tiver pouco tempo, leia nesta ordem:

1. [`C:\code_environment\workspace\pedidos-ms\apps\web\app\login\page.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\app\login\page.tsx)
2. [`C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\login\route.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\login\route.ts)
3. [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\controller\AuthController.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\controller\AuthController.java)
4. [`C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\service\AuthService.java`](C:\code_environment\workspace\pedidos-ms\auth-service\src\main\java\com\playground\auth\service\AuthService.java)
5. [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\controller\OrderController.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\controller\OrderController.java)
6. [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\service\OrderService.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\service\OrderService.java)
7. [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\event\OrderEventPublisher.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\event\OrderEventPublisher.java)
8. [`C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\consumer\OrderEventConsumer.java`](C:\code_environment\workspace\pedidos-ms\notification-service\src\main\java\com\playground\notification\consumer\OrderEventConsumer.java)
9. [`C:\code_environment\workspace\pedidos-ms\config-repo\api-gateway.yml`](C:\code_environment\workspace\pedidos-ms\config-repo\api-gateway.yml)
10. [`C:\code_environment\workspace\pedidos-ms\docker-compose.yml`](C:\code_environment\workspace\pedidos-ms\docker-compose.yml)

Essa sequencia te entrega uma visao muito forte do projeto inteiro.

---

## 11. Ordem longa para dominar de verdade

Se voce quiser aprender tudo com profundidade, siga esta trilha:

1. frontend paginas
2. frontend componentes
3. frontend route handlers
4. `lib/backend.ts` e `lib/types.ts`
5. `AuthController`
6. `AuthService`
7. `AppUser`, `UserRepository` e DTOs
8. `SecurityConfig`, `JwtService`, `JwtAuthenticationFilter`
9. `OrderController`
10. `OrderService`
11. `Order`, `OrderStatus`, `OrderRepository` e DTOs
12. `OrderEvent` e `OrderEventPublisher`
13. consumer e config Kafka do `notification-service`
14. `api-gateway.yml`
15. `ConfigServerApplication` e arquivos do `config-repo`
16. `DiscoveryServerApplication`
17. `docker-compose.yml`
18. `prometheus.yml` e dashboards Grafana
19. `ci.yml`
20. `up-and-test.ps1`

---

## 12. O que anotar enquanto estuda

Crie suas anotacoes respondendo sempre:

- entrada: quem chama esse arquivo?
- processamento: o que ele faz?
- saida: o que ele devolve?
- dependencia: de quem ele depende?
- risco: o que pode dar errado aqui?

Esse modelo de anotacao te ensina a pensar como engenheiro, nao so como leitor de codigo.

---

## 13. Missao pratica para consolidar

Depois de ler tudo, tente fazer sozinho sem olhar o codigo:

1. desenhar o fluxo de login
2. desenhar o fluxo de criacao de pedido
3. explicar por que existe gateway
4. explicar por que existe Kafka
5. explicar por que o frontend usa route handlers
6. explicar como o token chega do login ate a criacao do pedido

Se voce conseguir fazer isso, seu entendimento ja esta muito acima do superficial.
