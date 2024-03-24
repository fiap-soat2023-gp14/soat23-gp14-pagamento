# soat23-gp14-pagamento

## Descrição
Este Microserviço é reponsável por gerenciar os pagamentos dos pedido na Plataforma de Pedidos.
Ele possuis as funções de:
- Criar pagamento
- Receber pagamento
O serviço é responsavel por integrar com um gateway de pagamento (futuro) e em caso de erro, tratar o erro e retornar via fila para o service de pedido noticando o status do pagamento/integração.

## Pré-requisitos
- Node
- MongoDB
- SQS queues

## Executando a aplicação
- Faça o download do repositório através do arquivo zip ou do terminal usando o git clone
- Acesse o diretório do projeto pelo seu terminal
- Instale as dependências:
```bash
$ yarn install
```

Para rodar a aplicação localmente, é necessário criar as filas order-request e order-response no SQS, elas são usadas para coreagrafia da SAGA de pagamento do pedido. Atualize o arquivo local.env com as cofigurações.

```bash
# load configs to env
$ source local.env
```

- Inicie a aplicação
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test
Execute os testes:
```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```