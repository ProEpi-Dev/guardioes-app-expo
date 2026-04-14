# Sistema de Navegação

A navegação principal do app é governada pelo arquivo `src/navigation/RootNavigator.tsx`. O projeto utiliza uma abordagem padrão do React Navigation de separar a "Stack de Autenticação" da "Stack do Aplicativo" para proteger o acesso.

## RootNavigator (`RootNavigator.tsx`)

Ele ouve as alterações do `AuthContext`.

- Se o usuário **não estiver logado**, renderiza as rotas em `AuthStack` (Login, Cadastro).
- Se o usuário **estiver logado** (mas com perfil incompleto), pode renderizar a tela `FinishProfile`.
- Se o usuário estiver **completamente logado**, renderiza o `DrawerNavigator` ou `BottomNavigator`.

## Rotas de Autenticação (`src/screens/auth/`)

Geralmente organizadas em uma Stack Navigation padrão:

1. `Welcome`: Tela inicial com apresentação ou onboarding.
2. `Login`: Acesso de usuários existentes.
3. `Register`: Criação de uma nova conta.
4. `PasswordRecover`: Tela de esqueci a senha.
5. `FinishProfile`: Tela exigida caso o usuário se registre ou não tenha preenchido dados obrigatórios vitais do perfil.

## Rotas Privadas (`src/screens/app/`)

Nesta seção, temos um uso combinado de **Drawer** (Menu lateral) e **Stacks** baseadas em contexto.

1. **Rotas Principais (Tabs/Drawer)**:
   - Mapa de Sentimento / Relatório de Sintomas (`MapaSentimento`).
   - Feed de Artigos ou Notícias.
2. **Trail Stack (`TrailStack.tsx`)**:
   - Trilha de aprendizado do aplicativo (`TrailCard`, `TrailContent`).
3. **Quiz Stack (`QuizStack.tsx`)**:
   - Telas de pré-quiz (`QuizInfoScreen`), as questões (`QuizQuestionsScreen`) e o resultado gamificado (`QuizResultScreen`).

4. **Profile Stack (`ProfileStack.tsx`)**:
   - Onde o usuário gerencia seus dados da conta, configurações e altera a senha via `ChangePasswordModal` ou componentes internos.
