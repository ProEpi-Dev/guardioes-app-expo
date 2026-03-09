# Estrutura do Projeto

O código-fonte do aplicativo reside quase inteiramente na pasta `src/`. O projeto adota uma arquitetura modular orientada a funcionalidades e responsabilidades lógicas.

## Árvore de Diretórios (`/src`)

- **`components/`**: Contém todos os componentes visuais reutilizáveis. Exemplos notáveis:
  - `AlertModal/`: Modais genéricos de aviso.
  - `FormRenderer/`: Motor dinâmico que renderiza formulários de sintomas e perfis com base em JSON/Schemas (`FieldFactory.tsx`).
  - `MapWithFeeling/`: Componente de mapa com suporte a clusters e ícones.
  - `QuizCard/` e `ArticleCard/`: Componentes visuais para gamificação e notícias de saúde.

- **`contexts/`**: Contém a lógica de estado global da aplicação usando React Context API.
  - `AuthContext.tsx`: Gerencia as informações de sessão (token, usuário logado, fluxo de entrada/saída).
  - `ParticipationContext.tsx`: Contexto usado para gerenciar as interações do usuário nos formulários e relatórios.

- **`hooks/`**: Custom hooks do React para abstrair lógicas de negócio complexas.
  - Exemplos: `useAuth`, `useForm` (lógica do gerador de formulários), `useUserLocation` (geolocalização nativa), `useTrail`, `useQuizList`.

- **`img/`**: Armazena recursos de imagem, ícones e marcadores específicos do Google Maps. Organizado em pastas como `logos`, `icons`, `advices`, e `mapIcons`.

- **`locales/`**: Arquivos responsáveis pela internacionalização (i18n).
  - Possui os dicionários: `pt.js`, `en.js`, `es.js` e a configuração base no `i18n.js`.

- **`navigation/`**: Arquivos responsáveis pelas rotas. (Veja [NAVEGACAO.md](./NAVEGACAO.md) para mais detalhes).

- **`screens/`**: Telas isoladas da aplicação, divididas pelas seguintes categorias:
  - **`app/`**: Telas exclusivas para usuários logados (Mapa, Perfil, Área de Quizzes, Trilhas, Artigos).
  - **`auth/`**: Telas de acesso público (Welcome, Login, Registro, Recuperação de Senha).

- **`services/`**: Camada de requisições de rede. Arquivos que usam o `utils/api.js` (instância do Axios) para realizar chamadas REST ao backend.
  - Exemplos: `authStorage.ts`, `article.ts`, `reports.ts`, `quiz.ts`.

- **`types/`**: Arquivos TypeScript (`*.ts`) contendo as interfaces e tipagens estáticas para o sistema (ex: `auth.ts`, `profile.ts`, `formRenderer.ts`).

- **`utils/`**: Funções utilitárias e helpers.
  - `api.js`: Instância configurada do Axios (interceptor de token, base URL).
  - `colors.ts`: Paleta de cores oficial do app.
  - `consts.js`: Constantes globais do sistema.
  - `formatDate.ts`: Helper de formatação de datas.