# Arquitetura de Validações e Estratégias

Este documento explica as abordagens arquiteturais utilizadas para resolver lógicas complexas de formulários e validações dentro do aplicativo Guardiões da Saúde, especificamente detalhando o caso do **Identificador Externo**.

## Padrão Strategy Funcional (Factory Functions)

Devido às naturezas contextuais do aplicativo (por exemplo, estudantes da UnB vs. usuários de outras instituições), as regras de validação, os textos de orientação e os espaços reservados (_placeholders_) variam substancialmente.

### O Problema do Identificador Externo

Historicamente, o projeto utilizava o padrão _Strategy_ Clássico da Orientação a Objetos (com classes e interfaces instanciáveis). Contudo, isso gerava atritos com o paradigma central do React (que é fortemente focado na composição funcional, _Hooks_ e imutabilidade).

Problemas com a abordagem OO prévia:

- Dificuldade de injeção em validadores funcionais puros (como o **Zod**).
- Verbosidade desnecessária para apenas alternar propriedades de texto (labels).
- Complexidade em lidar com traduções (i18n).

### A Solução Implementada

A solução adotada foi migrar para um padrão de _Factory Functions_ em `src/utils/identifierStrategy.ts`. Em vez de instanciar classes de contexto, a aplicação invoca uma função pura que retorna um objeto literal com as definições e a regra de validação exigida.

Exemplo conceitual:

```typescript
export const getIdentifierStrategy = (type: 'unb_student' | 'default') => {
  return type === 'unb_student' ? unbStudentStrategy : defaultStrategy;
};
```

#### Vantagens da Abordagem

1. **Integração com o Zod:** O objeto literal retornado é facilmente acoplado no `superRefine` do esquema Zod dentro do arquivo `src/hooks/useFinishProfile.ts`. Isso unifica as regras e centraliza os disparos de erro no contexto principal do formulário (sem delegar regras diretamente para o React Hook Form field-a-field).
2. **Reatividade Híbrida:** A interface gráfica no React reage a mudanças na "escolha" da estratégia (ex: perguntando ao usuário se ele é um estudante e comutando de `default` para `unb_student`), enquanto a Factory devolve o novo contexto sem precisar recriar classes complexas na memória. O `zodResolver` é apenas memorizado com as novas opções.
3. **Internacionalização Perfeita:** A importação estática da função de tradução funciona de forma transparente em objetos puros, preservando a pureza da função de fábrica sem exigir acoplamento com o Ciclo de Vida do React via Hooks.

### Fluxo de Validação Híbrido (Backend + Frontend)

A lógica não se baseia apenas no tipo de usuário, mas também responde à obrigatoriedade vinda do Back-End. Através da flag `profileReq.externalIdentifier`, injetamos dinamicamente as regras no schema Zod, evitando falsos "sucessos" no preenchimento dos formulários caso o servidor exija aquele campo para o contexto atual do participante.

### Seletor de Tipo de Vínculo (Contexto UnB)

Para o contexto da UnB, nem todos os usuários são estudantes. Existe um seletor prévio ("Você é estudante da UnB?") que determina qual estratégia de validação será aplicada:

- **Estudante (Sim):** Aplica-se a estratégia `unb_student`, que valida o campo como uma matrícula de 9 dígitos numéricos (`/^\d{9}$/`).
- **Não-estudante (Não):** Aplica-se a estratégia `default`, que aceita identificadores alfanuméricos genéricos (`/^[a-zA-Z0-9]+$/`).

Esse seletor está presente em ambas as telas que manipulam o identificador externo:

- `src/screens/auth/FinishProfile/index.tsx` — Preenchimento inicial do perfil.
- `src/components/EditProfileModal/index.tsx` — Edição posterior do perfil.

Ao alternar a seleção, os campos de identificador e confirmação são automaticamente limpos para evitar que um valor inválido para o novo tipo de validação permaneça preenchido.

### Arquivos Envolvidos

| Arquivo                                     | Responsabilidade                                                                                                  |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/utils/identifierStrategy.ts`           | Factory Function que retorna o objeto de estratégia (label, placeholder, validate)                                |
| `src/hooks/useFinishProfile.ts`             | Hook que computa a estratégia reativa, monta o schema Zod dinâmico e exporta `DEFAULT_PROFILE_FIELD_REQUIREMENTS` |
| `src/screens/auth/FinishProfile/index.tsx`  | Tela de preenchimento inicial com seletor de estudante                                                            |
| `src/components/EditProfileModal/index.tsx` | Modal de edição com seletor de estudante                                                                          |
| `src/locales/pt.js`                         | Chaves de tradução sob `finishProfile.identifier.*`                                                               |
