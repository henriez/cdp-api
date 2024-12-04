# CDP Server

Servidor que concentra os dados de usuários e banco de exercícios do Clube de Programação da UTFPR

## Como rodar

Instale as dependências

```
npm i
```

Crie suas variáveis de ambiente

```
cp .env.example env
```

Configure as variáveis adequadamente para o seu ambiente. i.e. configure uma base de dados Postgres para utilizar localmente.

Para rodar localmente como um servidor NestJs

```
npm run dev
```

## Padrões

Para adicionar migrations, rode esse comando no diretório raíz do projeto

```
typeorm migration:create src/migrations/<migration-name>
```

## Documentações

Para ver a listagem dos endpoints, acesse o endpoint `/api` no seu navegador, haverá uma listagem de endpoints e como usá-los
