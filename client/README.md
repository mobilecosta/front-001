# Finanças Mobile - Frontend

Frontend React com Material-UI para o sistema de controle financeiro multi-tenant.

## 🏗️ Arquitetura

### Tecnologias

- **React 19** com TypeScript
- **Material-UI (MUI)** para componentes
- **Vite** como bundler
- **React Router** para navegação
- **Tailwind CSS** para estilos adicionais

### Estrutura do Projeto

```
client/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── DynamicForm.tsx  # Formulário dinâmico baseado em metadata
│   │   └── ...
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts       # Autenticação e sessão
│   │   └── useApi.ts        # Chamadas à API com JWT
│   ├── pages/               # Páginas da aplicação
│   │   ├── Dashboard.tsx
│   │   ├── Contas.tsx
│   │   ├── Categorias.tsx
│   │   ├── Transacoes.tsx
│   │   └── ...
│   ├── types/               # Tipos TypeScript
│   │   └── po-ui.types.ts
│   ├── App.tsx              # Componente raiz
│   └── main.tsx             # Ponto de entrada
├── public/                  # Arquivos estáticos
├── index.html
└── package.json
```

## 🚀 Começando

### Instalação

```bash
cd client
npm install
```

### Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### Build

```bash
npm run build
```

## 🔐 Autenticação

### Hook useAuth

```tsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login('email@example.com', 'password')}>Login</button>
      )}
    </>
  );
}
```

### Hook useApi

```tsx
import { useApi } from '../hooks/useApi';

function MyComponent() {
  const { get, post, put, delete: deleteApi } = useApi();

  const loadData = async () => {
    const data = await get('/api/contas');
    console.log(data);
  };

  return <button onClick={loadData}>Carregar</button>;
}
```

## 📋 Componentes

### DynamicForm

Renderiza formulários dinâmicos baseados em metadata da API.

```tsx
import DynamicForm from '../components/DynamicForm';

function MyPage() {
  const handleSubmit = async (data) => {
    await api.post('/api/contas', data);
  };

  return (
    <DynamicForm
      fields={formFields}
      onSubmit={handleSubmit}
      onCancel={() => setOpen(false)}
    />
  );
}
```

## 🎨 Tema Material-UI

O tema está configurado em `client/src/index.css` e pode ser customizado através de:

- Paleta de cores
- Tipografia
- Componentes customizados
- Breakpoints responsivos

## 📱 Responsividade

A aplicação é totalmente responsiva usando:

- **Grid System** do Material-UI
- **Media Queries** do Tailwind CSS
- **Componentes adaptáveis** para mobile

## 🧪 Testes

```bash
npm run test
```

## 📦 Deploy

### Vercel

```bash
vercel deploy
```

### Build estático

```bash
npm run build
# Arquivos em: dist/
```

## 🔗 Integração com Backend

Todas as chamadas à API passam pelo hook `useApi`, que:

1. Adiciona token JWT automaticamente
2. Trata erros
3. Gerencia loading states
4. Implementa retry automático

## 📚 Documentação de Componentes

### Dashboard

Exibe indicadores, gráficos e resumo financeiro.

**Props:**
- Nenhuma (usa dados da API)

**Funcionalidades:**
- Filtro por período
- Indicadores principais (saldo, receitas, despesas)
- Últimas transações

### Contas

CRUD de contas bancárias.

**Funcionalidades:**
- Listagem com paginação
- Criar nova conta
- Editar conta
- Deletar conta
- Visualizar saldo

### Categorias

CRUD de categorias de receita/despesa.

**Funcionalidades:**
- Listagem com filtro por tipo
- Criar categoria
- Editar categoria
- Deletar categoria

### Transações

CRUD de transações com filtros avançados.

**Funcionalidades:**
- Listagem com paginação
- Filtros (conta, categoria, período, status)
- Criar transação
- Editar transação
- Deletar transação
- Marcar como paga

## 🐛 Troubleshooting

### Erro de CORS

Verifique se o backend está rodando e se as variáveis de ambiente estão corretas.

### Token expirado

O frontend detecta automaticamente tokens expirados e solicita novo login.

### Componentes não aparecem

Verifique se o Material-UI está instalado: `npm install @mui/material @emotion/react @emotion/styled`

## 📝 Licença

MIT
