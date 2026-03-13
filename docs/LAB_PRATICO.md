# Lab Pratico - `pedidos-ms`

Este laboratorio foi feito para te tirar da leitura passiva e te colocar em modo de construcao.

A ideia e simples:

- voce ja tem o guia conceitual
- voce ja tem o roteiro de leitura por arquivo
- agora voce vai aprender implementando mudancas reais

Regra de Pareto:

- comece pelos exercicios que mais ensinam arquitetura, fluxo e seguranca
- deixe refinamentos e perfumaria por ultimo

---

## 1. Como usar este lab

Para cada exercicio, siga este ciclo:

1. entenda o objetivo
2. identifique os arquivos que provavelmente vao mudar
3. faca a implementacao
4. rode a aplicacao ou os testes
5. explique para si mesmo o que mudou no fluxo

Se travar, volte para estes arquivos de apoio:

- [`C:\code_environment\workspace\pedidos-ms\docs\GUIA_ESTUDO_COMPLETO.md`](C:\code_environment\workspace\pedidos-ms\docs\GUIA_ESTUDO_COMPLETO.md)
- [`C:\code_environment\workspace\pedidos-ms\docs\ROTEIRO_LEITURA_POR_ARQUIVO.md`](C:\code_environment\workspace\pedidos-ms\docs\ROTEIRO_LEITURA_POR_ARQUIVO.md)

---

## 2. Ordem ideal dos laboratorios

Siga nesta ordem:

1. fluxo completo
2. backend basico
3. frontend basico
4. seguranca
5. eventos
6. infraestrutura e operacao

Essa ordem evita que voce tente aprender tudo ao mesmo tempo.

---

## 3. Nivel 1 - Entender e reproduzir o fluxo principal

Objetivo: dominar o caminho mais importante do sistema.

### Exercicio 1.1 - Rodar tudo e navegar conscientemente

Tarefa:

- suba o ambiente
- faca cadastro
- faca login
- crie um pedido
- liste pedidos
- veja o Swagger
- veja o Kafka UI

Comandos:

```powershell
cd C:\code_environment\workspace\pedidos-ms
docker compose up --build -d
```

O que observar:

- quais portas cada servico usa
- em que momento o frontend chama o backend
- em que momento o pedido aparece na tela

Aprendizado principal:

- entender o sistema em execucao antes de mudar codigo

### Exercicio 1.2 - Desenhar o fluxo com suas palavras

Tarefa:

Sem olhar o guia, escreva:

- como funciona o login
- como funciona a criacao de pedido
- como o evento chega no consumer

Aprendizado principal:

- transformar leitura em modelo mental

---

## 4. Nivel 2 - Backend basico que mais ensina

Objetivo: aprender entidade, DTO, controller e service.

### Exercicio 2.1 - Adicionar campo `category` ao pedido

Tarefa:

Adicione um novo campo `category` em todo o fluxo.

Voce deve alterar:

- entidade `Order`
- `CreateOrderRequest`
- `OrderResponse`
- `OrderService`
- `OrderController` se necessario
- frontend de criacao e listagem

Arquivos para abrir primeiro:

- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\domain\Order.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\domain\Order.java)
- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\dto\CreateOrderRequest.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\dto\CreateOrderRequest.java)
- [`C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\dto\OrderResponse.java`](C:\code_environment\workspace\pedidos-ms\order-service\src\main\java\com\playground\orders\dto\OrderResponse.java)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\components\dashboard-client.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\components\dashboard-client.tsx)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\lib\types.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\lib\types.ts)

O que isso ensina:

- propagacao de contrato do banco ate a interface
- impacto de mudanca de dominio em varias camadas

### Exercicio 2.2 - Criar endpoint de detalhe de pedido por ID

Tarefa:

Criar um endpoint para buscar um pedido especifico.

Voce provavelmente vai mexer em:

- `OrderController`
- `OrderService`
- `OrderRepository`
- frontend ou collection para testar

O que isso ensina:

- desenho de endpoint REST
- busca orientada por identificador
- regra de acesso por usuario logado

### Exercicio 2.3 - Validar dados de entrada

Tarefa:

Adicione validacoes como:

- nome do produto obrigatorio
- quantidade maior que zero
- email valido no cadastro
- senha com tamanho minimo

O que isso ensina:

- validacao de entrada
- diferenca entre erro de regra e erro de formato
- protecao contra entrada ruim logo na borda do sistema

---

## 5. Nivel 3 - Frontend que mais ensina

Objetivo: aprender a camada web sem se perder em detalhes cosmeticos.

### Exercicio 3.1 - Mostrar dados do usuario logado no dashboard

Tarefa:

Mostre nome, email ou identificador do usuario no dashboard.

Arquivos mais provaveis:

- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\dashboard\page.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\app\dashboard\page.tsx)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\me\route.ts`](C:\code_environment\workspace\pedidos-ms\apps\web\app\api\auth\me\route.ts)
- [`C:\code_environment\workspace\pedidos-ms\apps\web\components\dashboard-client.tsx`](C:\code_environment\workspace\pedidos-ms\apps\web\components\dashboard-client.tsx)

O que isso ensina:

- leitura de sessao no frontend
- composicao de dados da pagina
- renderizacao baseada em autenticacao

### Exercicio 3.2 - Criar filtro de status na listagem

Tarefa:

Permita filtrar pedidos por status.

O que isso ensina:

- estado de interface
- filtragem de dados
- evolucao incremental de UX

### Exercicio 3.3 - Melhorar feedback visual de carregamento e erro

Tarefa:

Adicione estados claros de:

- carregando
- erro de rede
- sucesso ao criar pedido

O que isso ensina:

- UX real
- tratamento de falhas no front
- diferenca entre fluxo feliz e fluxo real

---

## 6. Nivel 4 - Seguranca que realmente importa

Objetivo: sair do superficial em autenticacao e autorizacao.

### Exercicio 4.1 - Criar endpoint `/me` no backend se ainda nao existir completo

Tarefa:

Garanta que exista um endpoint que devolve dados do usuario autenticado no `auth-service`.

O que isso ensina:

- como recuperar usuario do contexto de seguranca
- como diferenciar identidade autenticada de dados persistidos

### Exercicio 4.2 - Criar permissao administrativa para atualizar status

Tarefa:

Apenas usuarios com papel administrativo podem atualizar status do pedido.

Isso pode exigir:

- adicionar role no usuario
- incluir role no token
- validar role no `order-service`
- talvez ajustar tela para esconder a acao

O que isso ensina:

- diferenca entre autenticacao e autorizacao
- como politicas de acesso atravessam backend e frontend

### Exercicio 4.3 - Explicar o JWT do projeto

Tarefa:

Abra o codigo e escreva, com suas palavras:

- onde o token nasce
- onde e assinado
- onde e lido
- onde e validado
- como o `order-service` confia nele

O que isso ensina:

- entendimento estrutural de seguranca

---

## 7. Nivel 5 - Eventos e desacoplamento

Objetivo: entender o ganho real do Kafka.

### Exercicio 5.1 - Adicionar campo novo ao evento de pedido

Tarefa:

Adicione ao `OrderEvent` um campo extra, como `category` ou `createdAt`.

Voce deve propagar isso em:

- `order-service`
- `notification-service`

O que isso ensina:

- contratos de evento
- acoplamento entre producer e consumer
- impacto de evolucao de payload

### Exercicio 5.2 - Criar um segundo consumer

Tarefa:

Crie um novo servico consumidor, por exemplo:

- `audit-service`
- ou um novo consumer no mesmo servico, apenas para estudo

Esse consumer pode:

- logar evento
- salvar auditoria
- simular envio para outro sistema

O que isso ensina:

- expansao horizontal baseada em eventos
- por que eventos escalam bem organizacionalmente

### Exercicio 5.3 - Comparar HTTP x Kafka neste projeto

Tarefa:

Explique por escrito:

- o que faria sentido continuar via HTTP
- o que faz sentido virar evento
- quando eventos piorariam a complexidade sem necessidade

O que isso ensina:

- maturidade arquitetural
- evitar usar mensageria so porque parece avancado

---

## 8. Nivel 6 - Infraestrutura e operacao

Objetivo: aprender o que muita gente ignora, mas o mercado valoriza muito.

### Exercicio 6.1 - Ler e explicar o `docker-compose.yml`

Tarefa:

Explique cada bloco principal:

- config-server
- discovery-server
- bancos
- kafka
- gateway
- frontend
- monitoring

O que isso ensina:

- topologia real do sistema
- ordem de dependencia
- servicos obrigatorios vs auxiliares

### Exercicio 6.2 - Alterar um healthcheck conscientemente

Tarefa:

Escolha um servico e entenda:

- o endpoint usado no healthcheck
- por que esse endpoint e confiavel
- como a dependencia muda quando o healthcheck falha

O que isso ensina:

- prontidao de servico
- diferenca entre processo vivo e servico pronto

### Exercicio 6.3 - Entender Prometheus e Grafana

Tarefa:

Explique:

- quem expoe metricas
- quem coleta metricas
- quem visualiza metricas

Arquivos:

- [`C:\code_environment\workspace\pedidos-ms\monitoring\prometheus.yml`](C:\code_environment\workspace\pedidos-ms\monitoring\prometheus.yml)
- [`C:\code_environment\workspace\pedidos-ms\monitoring\grafana\provisioning\datasources\datasource.yml`](C:\code_environment\workspace\pedidos-ms\monitoring\grafana\provisioning\datasources\datasource.yml)
- [`C:\code_environment\workspace\pedidos-ms\monitoring\grafana\provisioning\dashboards\json\pedidos-ms-dashboard.json`](C:\code_environment\workspace\pedidos-ms\monitoring\grafana\provisioning\dashboards\json\pedidos-ms-dashboard.json)

O que isso ensina:

- operacao real de sistema distribuido

### Exercicio 6.4 - Entender o CI

Tarefa:

Leia e explique o pipeline em:

- [`C:\code_environment\workspace\pedidos-ms\.github\workflows\ci.yml`](C:\code_environment\workspace\pedidos-ms\.github\workflows\ci.yml)

O que isso ensina:

- automacao de confianca
- como qualidade vira processo

---

## 9. Nivel 7 - Desafios de consolidacao

Objetivo: juntar varias partes do sistema em uma unica mudanca.

### Desafio 7.1 - Campo novo do banco ate o dashboard

Tarefa:

Crie um campo novo do inicio ao fim.

Fluxo que voce deve alterar:

- entidade
- DTO
- service
- controller
- evento Kafka se fizer sentido
- route handler do Next
- tipo do frontend
- formulario e listagem

Esse e um dos melhores exercicios de todo o projeto.

### Desafio 7.2 - Auditoria simples de pedidos

Tarefa:

Cada criacao de pedido deve gerar um registro de auditoria.

Voce pode fazer isso de dois jeitos:

- via novo consumer Kafka
- via log estruturado simples

Esse desafio te obriga a pensar em arquitetura, nao so em codigo.

### Desafio 7.3 - Restringir visualizacao por usuario

Tarefa:

Garanta que um usuario so veja os proprios pedidos, inclusive em endpoints novos que voce criar.

Esse exercicio e excelente para testar se voce realmente entendeu autenticacao e dominio.

---

## 10. Como saber qual exercicio fazer primeiro

Se seu foco for aprender mais rapido, siga esta prioridade:

1. `category` no pedido
2. mostrar usuario no dashboard
3. validacoes de entrada
4. endpoint por ID
5. role administrativa
6. campo novo em evento Kafka
7. segundo consumer
8. auditoria

Essa ordem entrega muito aprendizado com pouco desperdicio.

---

## 11. Checklist de aprendizagem real

Voce esta avancando bem se, apos os labs, conseguir:

- alterar backend e frontend sem se perder
- explicar o caminho do token
- explicar por que o gateway existe
- explicar por que o Kafka foi usado
- dizer onde a regra de negocio mora
- dizer onde a configuracao mora
- dizer como o sistema e monitorado
- propor uma nova feature sem quebrar a arquitetura

---

## 12. Regra final para estudar melhor

Nao tente fazer todos os labs de uma vez.

Faça assim:

1. pegue um exercicio pequeno
2. implemente
3. rode
4. explique o que mudou
5. so depois passe para o proximo

Aprender arquitetura e engenharia e muito mais sobre sequencia boa do que sobre pressa.
