
# Instruções para Implementação do Backend e Banco de Dados

## Visão Geral da Arquitetura

Para implementar o backend do iGustaStore, recomendamos uma arquitetura baseada em:
- **Backend**: Node.js com Express
- **Banco de dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **ORM**: Prisma ou TypeORM

## 1. Configuração do Banco de Dados

### Modelo de Dados

#### Tabelas Principais:
1. **Users** - Administradores do sistema
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     password VARCHAR(100) NOT NULL,
     name VARCHAR(100) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Devices** - Inventário de dispositivos
   ```sql
   CREATE TABLE devices (
     id SERIAL PRIMARY KEY,
     model VARCHAR(100) NOT NULL,
     brand VARCHAR(50) NOT NULL,
     storage VARCHAR(20) NOT NULL,
     color VARCHAR(30) NOT NULL,
     condition VARCHAR(20) NOT NULL,
     cost_price DECIMAL(10,2) NOT NULL,
     sale_price DECIMAL(10,2) NOT NULL,
     imei VARCHAR(50) UNIQUE,
     is_sold BOOLEAN DEFAULT false,
     created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     notes TEXT,
     image_url VARCHAR(255)
   );
   ```

3. **Sales** - Registro de vendas
   ```sql
   CREATE TABLE sales (
     id SERIAL PRIMARY KEY,
     device_id INTEGER REFERENCES devices(id),
     customer_id INTEGER REFERENCES customers(id),
     sale_price DECIMAL(10,2) NOT NULL,
     sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     payment_method VARCHAR(30) NOT NULL,
     notes TEXT
   );
   ```

4. **Customers** - Cadastro de clientes
   ```sql
   CREATE TABLE customers (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100),
     phone VARCHAR(20),
     address TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Expenses** - Registro de despesas
   ```sql
   CREATE TABLE expenses (
     id SERIAL PRIMARY KEY,
     description VARCHAR(255) NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     category VARCHAR(50) NOT NULL,
     date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

6. **Suppliers** - Cadastro de fornecedores
   ```sql
   CREATE TABLE suppliers (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     contact_name VARCHAR(100),
     email VARCHAR(100),
     phone VARCHAR(20),
     address TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## 2. Configuração do Backend

### Estrutura de Pastas Recomendada

```
/backend
  /src
    /controllers
    /middleware
    /models
    /routes
    /services
    /utils
    app.js
    server.js
  /prisma
    schema.prisma
  package.json
```

### Instalação e Configuração

1. **Iniciar o projeto**
   ```bash
   mkdir backend
   cd backend
   npm init -y
   npm install express cors dotenv bcrypt jsonwebtoken prisma @prisma/client
   npm install --save-dev nodemon
   ```

2. **Configurar Prisma**
   ```bash
   npx prisma init
   ```
   
   Edite o arquivo `.env` para incluir sua string de conexão com o banco de dados:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/igustastoredb"
   ```

3. **Definir o Schema do Prisma**
   Crie o modelo de dados no arquivo `prisma/schema.prisma`

4. **Gerar o Cliente do Prisma**
   ```bash
   npx prisma generate
   ```

5. **Migrar o Esquema do Banco**
   ```bash
   npx prisma migrate dev --name init
   ```

## 3. Implementação das APIs

### Endpoints Principais

1. **Autenticação**
   - POST `/api/auth/login` - Login de usuário
   - POST `/api/auth/register` - Registro de novo usuário (admin)
   - GET `/api/auth/profile` - Obter perfil do usuário autenticado

2. **Dispositivos**
   - GET `/api/devices` - Listar todos os dispositivos
   - GET `/api/devices/:id` - Obter detalhes de um dispositivo
   - POST `/api/devices` - Adicionar novo dispositivo
   - PUT `/api/devices/:id` - Atualizar um dispositivo
   - DELETE `/api/devices/:id` - Remover um dispositivo

3. **Vendas**
   - GET `/api/sales` - Listar todas as vendas
   - GET `/api/sales/:id` - Obter detalhes de uma venda
   - POST `/api/sales` - Registrar nova venda
   - GET `/api/sales/stats` - Obter estatísticas de vendas

4. **Clientes**
   - GET `/api/customers` - Listar todos os clientes
   - POST `/api/customers` - Adicionar novo cliente
   - PUT `/api/customers/:id` - Atualizar cliente
   - GET `/api/customers/:id` - Obter detalhes de um cliente

5. **Despesas**
   - GET `/api/expenses` - Listar todas as despesas
   - POST `/api/expenses` - Adicionar nova despesa
   - GET `/api/expenses/stats` - Obter estatísticas de despesas

6. **Fornecedores**
   - GET `/api/suppliers` - Listar todos os fornecedores
   - POST `/api/suppliers` - Adicionar novo fornecedor
   - PUT `/api/suppliers/:id` - Atualizar fornecedor

7. **Relatórios**
   - GET `/api/reports/sales` - Relatório de vendas
   - GET `/api/reports/inventory` - Relatório de inventário
   - GET `/api/reports/profit` - Relatório de lucros

## 4. Middleware e Autenticação

1. **Middleware de Autenticação**
   ```javascript
   // middleware/auth.js
   const jwt = require("jsonwebtoken");

   module.exports = (req, res, next) => {
     const token = req.header("x-auth-token");
     if (!token) return res.status(401).json({ msg: "Acesso negado. Token não fornecido." });

     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (err) {
       res.status(400).json({ msg: "Token inválido" });
     }
   };
   ```

2. **Configuração de CORS**
   ```javascript
   // app.js
   const cors = require("cors");
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

## 5. Deploy e Ambiente de Produção

1. **Configurações de Ambiente**
   - Usar variáveis de ambiente para senhas e chaves
   - Configurar diferentes ambientes (dev, staging, prod)

2. **Opções de Hospedagem**
   - Backend: Heroku, Render, Railway, DigitalOcean
   - Banco de dados: Supabase, Railway, ElephantSQL, Neon

3. **Segurança**
   - Implementar rate limiting
   - Validar todas as entradas de usuário
   - Usar HTTPS em todos os ambientes
   - Implementar proteção contra ataques comuns (XSS, CSRF, SQL Injection)

## 6. Integração com o Frontend

1. **Cliente HTTP**
   - Usar Axios ou fetch para comunicação com API
   - Configurar interceptors para tokens e refresh

2. **Gerenciamento de Estado**
   - Configurar React Query para gerenciamento de estado do servidor
   - Implementar cache e invalidação de cache

3. **Autenticação no Frontend**
   - Armazenar token JWT no localStorage ou cookies
   - Implementar redirecionamentos para páginas protegidas

## Conclusão

Esta arquitetura fornece uma base sólida para implementar o backend do iGustaStore. A estrutura modular e escalável permite adicionar novas funcionalidades e adaptar o sistema conforme necessário. A escolha de PostgreSQL com Prisma oferece um equilíbrio entre performance, facilidade de desenvolvimento e resources disponíveis.

Para iniciar o desenvolvimento, recomenda-se implementar primeiro a autenticação e o CRUD básico de dispositivos, seguido pelo sistema de vendas. O restante das funcionalidades pode ser desenvolvido incrementalmente conforme a necessidade.
