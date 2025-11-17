# Implementação: Autenticação e Formulários Dinâmicos

Este documento resume todas as implementações realizadas para autenticação e sistema de formulários dinâmicos no app Guardiões da Saúde.

## 📋 Índice

1. [Sistema de Autenticação](#sistema-de-autenticação)
2. [Context API para Gerenciamento de Estado](#context-api-para-gerenciamento-de-estado)
3. [Integração com API](#integração-com-api)
4. [Componente de Mapa com Sentimento](#componente-de-mapa-com-sentimento)
5. [Sistema de Formulários Dinâmicos](#sistema-de-formulários-dinâmicos)
6. [Tela de Mapa Sentimento](#tela-de-mapa-sentimento)

---

## 🔐 Sistema de Autenticação

### Arquivos Criados

#### `src/contexts/AuthContext.tsx`
- Context API para gerenciar estado de autenticação
- Funções principais:
  - `login(email, password)`: Realiza login e busca forms automaticamente
  - `logout()`: Limpa dados de autenticação
  - `updateUser(userData)`: Atualiza dados do usuário
- Estados gerenciados:
  - `user`: Dados do usuário logado
  - `token`: Token de autenticação
  - `isAuthenticated`: Status de autenticação
  - `isLoading`: Estado de carregamento
  - `form`: Primeiro form disponível (carregado após login)

#### `src/services/authStorage.ts`
- Serviço para armazenamento seguro usando AsyncStorage
- Funções:
  - `storeToken(token)`: Armazena token
  - `getToken()`: Recupera token
  - `removeToken()`: Remove token
  - `storeUser(userData)`: Armazena dados do usuário
  - `getUser()`: Recupera dados do usuário
  - `clearAuthData()`: Limpa todos os dados de autenticação

#### `src/types/auth.ts`
- Tipos TypeScript para autenticação:
  - `User`: Interface para dados do usuário
  - `LoginResponse`: Resposta da API de login
  - `LoginResult`: Resultado do processo de login
  - `ApiError`: Estrutura de erros da API
  - `Form`: Interface para formulários
  - `PaginatedResponse<T>`: Resposta paginada genérica
  - `AuthContextType`: Tipo do contexto de autenticação

### Funcionalidades Implementadas

1. **Login Automático**
   - Verifica token salvo ao iniciar o app
   - Restaura sessão se token válido existir
   - Busca forms automaticamente após login

2. **Busca Automática de Forms**
   - Após login bem-sucedido, faz GET para `/v1/forms`
   - Filtra por `active=true`
   - Armazena o primeiro form disponível no context
   - Também busca ao verificar estado de autenticação

3. **Navegação Baseada em Autenticação**
   - `RootNavigator` verifica estado de autenticação
   - Redireciona automaticamente para tela apropriada
   - Rotas protegidas vs rotas públicas

---

## 🗺️ Componente de Mapa com Sentimento

### Arquivo: `src/components/MapWithFeeling/index.tsx`

**Características:**
- Mapa em tela cheia usando `react-native-maps`
- Card fixo na parte inferior com pergunta de sentimento
- Dois botões: "BEM" (azul) e "MAL" (laranja)
- Respeita SafeArea para dispositivos com notch
- Callback `onFeelingSelected` para tratar seleção

**Props:**
```typescript
interface MapWithFeelingProps {
  onFeelingSelected?: (feeling: 'good' | 'bad') => void;
}
```

**Uso:**
```typescript
<MapWithFeeling onFeelingSelected={(feeling) => {
  // Tratar seleção
}} />
```

---

## 📝 Sistema de Formulários Dinâmicos

### Arquivos Criados

#### `src/types/form.ts`
Tipos TypeScript para formulários:
- `FieldType`: Tipos de campos suportados (text, number, boolean, select, multiselect)
- `ConditionOperator`: Operadores de condição
- `FormField`: Estrutura de um campo
- `FormBuilderDefinition`: Definição completa do formulário
- `FormVersion`: Versão do formulário com definition

#### `src/components/FormRenderer/index.tsx`
Componente principal para renderizar formulários dinâmicos.

**Funcionalidades:**
1. **Tipos de Campos Suportados:**
   - ✅ Text: Campo de texto simples
   - ✅ Number: Campo numérico com validação min/max
   - ✅ Boolean: Switch/Checkbox
   - ✅ Select: Dropdown de seleção única (usando @react-native-picker/picker)
   - ✅ Multiselect: Seleção múltipla com checkboxes

2. **Sistema de Validação:**
   - Validação em tempo real
   - Campos obrigatórios (`required: true`)
   - Validação de números (min/max)
   - Validação de texto (maxLength)
   - Mensagens de erro exibidas abaixo dos campos
   - Propriedade `_isValid` no objeto de valores

3. **Sistema de Condições:**
   - Campos condicionais baseados em valores de outros campos
   - Operadores suportados:
     - `equals`, `notEquals`
     - `contains` (para arrays e strings)
     - `greaterThan`, `lessThan`
     - `isEmpty`, `isNotEmpty`
   - Campos ocultos não são validados
   - Reavaliação automática quando valores mudam

4. **Props:**
```typescript
interface FormRendererProps {
  definition: FormBuilderDefinition;
  initialValues?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  readOnly?: boolean;
}
```

**Exemplo de Uso:**
```typescript
<FormRenderer
  definition={formDefinition}
  onChange={(values) => {
    // values contém todos os valores
    // values._isValid indica se está válido
  }}
/>
```

---

## 🗺️ Tela de Mapa Sentimento

### Arquivo: `src/screens/app/MapaSentimento/index.tsx`

**Funcionalidades Implementadas:**

1. **Integração com Mapa:**
   - Usa componente `MapWithFeeling`
   - Trata seleção de sentimento (BEM/MAL)

2. **Fluxo ao Clicar em "MAL":**
   - Busca versão ativa do form do context
   - Faz GET para `/v1/forms/{formId}/versions?active=true`
   - Carrega a `definition` do form version
   - Exibe formulário em tela cheia

3. **Tela de Formulário:**
   - **Header**: Botão X no canto direito para fechar
   - **Conteúdo**: FormRenderer com scroll
   - **Footer**: Botões Cancelar e Enviar
   - **KeyboardAvoidingView**: Ajusta quando teclado aparece

4. **Validação e Envio:**
   - Valida todos os campos obrigatórios antes de enviar
   - Remove `_isValid` antes de enviar para API
   - TODO: Implementar chamada à API para criar report

**Estrutura Visual:**
```
┌─────────────────────────┐
│                    [X]  │  ← Header (azul, botão fechar)
├─────────────────────────┤
│                         │
│   [Formulário com       │  ← Área scrollável
│    scroll]              │
│                         │
├─────────────────────────┤
│ [Cancelar]  [Enviar]    │  ← Footer fixo
└─────────────────────────┘
```

---

## 🔌 Integração com API

### Arquivo: `src/utils/api.js`

**Configuração:**
- URL Base: `https://devapi.gds.proepi.org.br`
- Cliente HTTP básico: `apiClient(endpoint, options)`
- Cliente autenticado: `authenticatedApiClient(endpoint, token, options)`

**Endpoints Utilizados:**

1. **POST `/v1/auth/login`**
   - Autenticação de usuário
   - Retorna token e dados do usuário

2. **GET `/v1/forms?page=1&pageSize=10&active=true`**
   - Lista formulários ativos
   - Chamado automaticamente após login
   - Retorna resposta paginada

3. **GET `/v1/forms/{formId}/versions?active=true`**
   - Busca versões ativas de um formulário
   - Chamado ao clicar em "MAL"
   - Retorna versão com `definition`

---

## 🎨 Melhorias na Tela Home

### Arquivo: `src/screens/Home/index.js`

**Mudanças:**
- Integrado com `useAuth()` para acessar dados do usuário
- Exibe nome do usuário logado dinamicamente
- Lógica de capitalização:
  - Se tiver `name`, exibe capitalizado
  - Se não tiver `name`, usa parte do email antes do @
  - Fallback: "Usuário"

---

## 📦 Dependências Adicionadas

```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-native-picker/picker": "^x.x.x"
}
```

---

## 🔄 Fluxo Completo

### 1. Login
```
Usuário faz login
  ↓
Token e dados salvos no AsyncStorage
  ↓
Busca automática de forms (/v1/forms)
  ↓
Primeiro form salvo no context
  ↓
Navegação para tela Home
```

### 2. Seleção de Sentimento
```
Usuário na tela Mapa Sentimento
  ↓
Clica em "MAL"
  ↓
Busca versão do form (/v1/forms/{id}/versions)
  ↓
Carrega definition do form
  ↓
Exibe formulário em tela cheia
  ↓
Usuário preenche e envia
  ↓
Validação e envio para API (TODO)
```

---

## 📝 TODOs Pendentes

1. **Envio de Report:**
   - Implementar chamada à API `/v1/reports` ao enviar formulário
   - Incluir `formVersionId`, `formResponse`, `reportType`

2. **Envio de Sentimento "BEM":**
   - Implementar chamada à API para registrar sentimento positivo
   - Possivelmente criar report com `reportType: 'NEGATIVE'`

3. **Tratamento de Erros:**
   - Melhorar tratamento de erros de rede
   - Adicionar retry automático
   - Mensagens de erro mais amigáveis

4. **Persistência de Form:**
   - Considerar salvar form version no context para evitar busca repetida

---

## 🎯 Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Context de autenticação
├── services/
│   └── authStorage.ts           # Armazenamento de dados
├── types/
│   ├── auth.ts                  # Tipos de autenticação
│   └── form.ts                  # Tipos de formulários
├── components/
│   ├── MapWithFeeling/
│   │   └── index.tsx           # Componente mapa + sentimento
│   └── FormRenderer/
│       └── index.tsx            # Renderizador de formulários
├── screens/
│   ├── app/
│   │   └── MapaSentimento/
│   │       └── index.tsx       # Tela principal
│   └── Home/
│       └── index.js             # Tela home (atualizada)
└── utils/
    └── api.js                   # Cliente HTTP
```

---

## ✅ Checklist de Implementação

- [x] Context API para autenticação
- [x] Armazenamento seguro de token e dados
- [x] Busca automática de forms após login
- [x] Componente de mapa com card de sentimento
- [x] FormRenderer com todos os tipos de campos
- [x] Sistema de validação em tempo real
- [x] Sistema de condições para campos condicionais
- [x] Tela cheia para formulário
- [x] Integração com API para buscar form versions
- [x] Navegação baseada em autenticação
- [x] Exibição de dados do usuário na Home
- [ ] Envio de report para API (TODO)
- [ ] Tratamento avançado de erros (TODO)

---

## 📚 Referências

- Documentação de formulários: `instructions-form-renderer.md`
- API Swagger: `https://devapi.gds.proepi.org.br/api`
- AsyncStorage: `@react-native-async-storage/async-storage`
- React Native Maps: `react-native-maps`
- React Native Picker: `@react-native-picker/picker`

---

**Última atualização:** Implementação completa de autenticação e sistema de formulários dinâmicos.

