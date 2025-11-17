# Instruções: Renderização de Formulários Dinâmicos

Este documento descreve como o frontend web renderiza formulários dinâmicos baseados em definições JSON. Use este guia como referência para implementar a mesma funcionalidade no app React Native/Expo.

## Visão Geral

O sistema de formulários dinâmicos permite criar formulários configuráveis através de uma definição JSON armazenada no backend. A definição especifica campos, tipos, validações e condições de exibição.

## Estrutura da Definição do Formulário

A definição do formulário é um objeto JSON com a seguinte estrutura:

```typescript
interface FormBuilderDefinition {
  fields: FormField[];
  title?: string;
  description?: string;
}
```

### Estrutura de um Campo (FormField)

```typescript
interface FormField {
  id: string;                    // ID único do campo (usado para condições)
  type: FieldType;                // Tipo do campo
  label: string;                  // Rótulo exibido ao usuário
  name: string;                   // Nome do campo (chave no objeto de valores)
  required?: boolean;              // Se o campo é obrigatório
  placeholder?: string;           // Texto de placeholder
  defaultValue?: any;            // Valor padrão do campo
  
  // Para campos select e multiselect
  options?: Array<{
    label: string;                // Rótulo da opção
    value: string | number;        // Valor da opção
  }>;
  
  // Para campos number
  min?: number;                   // Valor mínimo
  max?: number;                   // Valor máximo
  
  // Para campos text
  maxLength?: number;             // Comprimento máximo
  
  // Condições de exibição (campos condicionais)
  conditions?: FieldCondition[];
  
  // Validações customizadas (futuro)
  validation?: {
    pattern?: string;             // Regex pattern
    message?: string;             // Mensagem de erro customizada
  };
}
```

## Tipos de Campos Suportados

### 1. Text (`'text'`)
Campo de texto simples.

**Propriedades específicas:**
- `maxLength?: number` - Limite máximo de caracteres

**Exemplo:**
```json
{
  "id": "field-1",
  "type": "text",
  "label": "Nome completo",
  "name": "fullName",
  "required": true,
  "placeholder": "Digite seu nome",
  "maxLength": 100
}
```

**Comportamento:**
- Aceita qualquer texto
- Valida comprimento máximo se `maxLength` estiver definido
- Valida obrigatoriedade se `required: true`

### 2. Number (`'number'`)
Campo numérico.

**Propriedades específicas:**
- `min?: number` - Valor mínimo permitido
- `max?: number` - Valor máximo permitido

**Exemplo:**
```json
{
  "id": "field-2",
  "type": "number",
  "label": "Idade",
  "name": "age",
  "required": true,
  "placeholder": "Digite sua idade",
  "min": 0,
  "max": 120
}
```

**Comportamento:**
- Aceita apenas números
- Valida valores mínimo e máximo se definidos
- Retorna `null` se o campo estiver vazio
- Valida obrigatoriedade se `required: true`

### 3. Boolean (`'boolean'`)
Checkbox (verdadeiro/falso).

**Exemplo:**
```json
{
  "id": "field-3",
  "type": "boolean",
  "label": "Concordo com os termos",
  "name": "acceptTerms",
  "required": true
}
```

**Comportamento:**
- Retorna `true` ou `false`
- Valor padrão é `false` se não preenchido
- Valida obrigatoriedade se `required: true` (deve ser `true`)

### 4. Select (`'select'`)
Dropdown de seleção única.

**Propriedades específicas:**
- `options: Array<{label: string, value: string | number}>` - Lista de opções

**Exemplo:**
```json
{
  "id": "field-4",
  "type": "select",
  "label": "Estado",
  "name": "state",
  "required": true,
  "options": [
    { "label": "São Paulo", "value": "SP" },
    { "label": "Rio de Janeiro", "value": "RJ" },
    { "label": "Minas Gerais", "value": "MG" }
  ]
}
```

**Comportamento:**
- Permite selecionar apenas uma opção
- Retorna o `value` da opção selecionada
- Valida obrigatoriedade se `required: true`

### 5. Multiselect (`'multiselect'`)
Dropdown de seleção múltipla.

**Propriedades específicas:**
- `options: Array<{label: string, value: string | number}>` - Lista de opções

**Exemplo:**
```json
{
  "id": "field-5",
  "type": "multiselect",
  "label": "Sintomas",
  "name": "symptoms",
  "required": true,
  "options": [
    { "label": "Febre", "value": "fever" },
    { "label": "Tosse", "value": "cough" },
    { "label": "Dor de cabeça", "value": "headache" }
  ]
}
```

**Comportamento:**
- Permite selecionar múltiplas opções
- Retorna um array com os `value` das opções selecionadas
- Retorna array vazio `[]` se nenhuma opção for selecionada
- Valida obrigatoriedade se `required: true` (array não pode estar vazio)

## Sistema de Condições (Campos Condicionais)

Campos podem ser exibidos condicionalmente baseado nos valores de outros campos. Use a propriedade `conditions` para definir quando um campo deve ser exibido.

### Estrutura de Condição

```typescript
interface FieldCondition {
  fieldId: string;              // ID do campo que será verificado
  operator: ConditionOperator;   // Operador de comparação
  value: any;                    // Valor de comparação
}
```

### Operadores Disponíveis

| Operador | Descrição | Exemplo |
|----------|-----------|---------|
| `equals` | Igual a | `fieldId === value` |
| `notEquals` | Diferente de | `fieldId !== value` |
| `contains` | Contém (string) | `String(fieldId).includes(String(value))` |
| `greaterThan` | Maior que | `Number(fieldId) > Number(value)` |
| `lessThan` | Menor que | `Number(fieldId) < Number(value)` |
| `isEmpty` | Está vazio | `!fieldId \|\| fieldId === '' \|\| (Array.isArray(fieldId) && fieldId.length === 0)` |
| `isNotEmpty` | Não está vazio | `fieldId && fieldId !== '' && (!Array.isArray(fieldId) \|\| fieldId.length > 0)` |

### Lógica de Avaliação

- **Todas as condições devem ser verdadeiras (AND)**: Se um campo tem múltiplas condições, todas devem ser satisfeitas para o campo ser exibido.
- O campo é ocultado se qualquer condição for falsa.

### Exemplo de Campo Condicional

```json
{
  "id": "field-6",
  "type": "text",
  "label": "Especifique o sintoma",
  "name": "symptomDetail",
  "conditions": [
    {
      "fieldId": "field-5",
      "operator": "contains",
      "value": "fever"
    }
  ]
}
```

Neste exemplo, o campo "Especifique o sintoma" só será exibido se o campo com `id: "field-5"` (que é um multiselect de sintomas) contiver o valor `"fever"`.

## Sistema de Validação

### Validações Automáticas

O sistema valida automaticamente:

1. **Campos obrigatórios (`required: true`)**:
   - Text: não pode ser vazio (`''`)
   - Number: não pode ser `null` ou `undefined`
   - Boolean: deve ser `true` (se `required: true`)
   - Select: deve ter um valor selecionado
   - Multiselect: array não pode estar vazio

2. **Validação de número**:
   - `min`: valor deve ser >= `min`
   - `max`: valor deve be <= `max`

3. **Validação de texto**:
   - `maxLength`: comprimento não pode exceder `maxLength`

### Mensagens de Erro Padrão

- Campo obrigatório: `"{label} é obrigatório"`
- Número menor que mínimo: `"Valor deve ser maior ou igual a {min}"`
- Número maior que máximo: `"Valor deve ser menor ou igual a {max}"`
- Texto muito longo: `"Máximo de {maxLength} caracteres"`

### Estado de Validação

O componente `FormRenderer` retorna um objeto de valores com uma propriedade especial `_isValid`:

```typescript
{
  field1: "valor1",
  field2: 123,
  _isValid: true  // Indica se o formulário está válido
}
```

**Importante**: Remova `_isValid` antes de enviar os dados para o backend.

## Como Usar o FormRenderer

### Props do Componente

```typescript
interface FormRendererProps {
  definition: FormBuilderDefinition;        // Definição do formulário
  initialValues?: Record<string, any>;       // Valores iniciais (opcional)
  onChange?: (values: Record<string, any>) => void;  // Callback de mudanças
  readOnly?: boolean;                        // Modo somente leitura (opcional)
}
```

### Exemplo de Uso Básico

```typescript
import FormRenderer from './components/FormRenderer';

function MyForm() {
  const [formValues, setFormValues] = useState({});
  
  const definition = {
    fields: [
      {
        id: "field-1",
        type: "text",
        label: "Nome",
        name: "name",
        required: true
      },
      {
        id: "field-2",
        type: "number",
        label: "Idade",
        name: "age",
        min: 0,
        max: 120
      }
    ]
  };

  const handleChange = (values: Record<string, any>) => {
    setFormValues(values);
    console.log('Formulário válido?', values._isValid);
  };

  return (
    <FormRenderer
      definition={definition}
      initialValues={{}}
      onChange={handleChange}
    />
  );
}
```

### Exemplo com Valores Iniciais

```typescript
const initialValues = {
  name: "João Silva",
  age: 30
};

<FormRenderer
  definition={definition}
  initialValues={initialValues}
  onChange={handleChange}
/>
```

### Modo Somente Leitura

```typescript
<FormRenderer
  definition={definition}
  initialValues={formValues}
  readOnly={true}
/>
```

## Fluxo de Dados

### 1. Obter Definição do Formulário

A definição vem do backend na propriedade `definition` de uma versão de formulário:

```typescript
// Exemplo de resposta da API
{
  id: 1,
  form_id: 1,
  version_number: 1,
  definition: {
    fields: [...]
  }
}
```

### 2. Renderizar Formulário

```typescript
<FormRenderer
  definition={formVersion.definition}
  onChange={(values) => {
    // values contém todos os valores dos campos
    // values._isValid indica se está válido
  }}
/>
```

### 3. Coletar Dados

O callback `onChange` é chamado sempre que qualquer campo muda. O objeto retornado contém:
- Todos os valores dos campos (usando `name` como chave)
- Propriedade `_isValid` indicando se o formulário está válido

### 4. Enviar para o Backend

Antes de enviar, remova `_isValid`:

```typescript
const handleSubmit = () => {
  const { _isValid, ...cleanFormResponse } = formValues;
  
  if (!_isValid) {
    alert('Preencha todos os campos obrigatórios');
    return;
  }
  
  // Enviar cleanFormResponse para o backend
  api.createReport({
    formResponse: cleanFormResponse,
    // outros campos...
  });
};
```

## Comportamentos Importantes

### Reset de Valores

- Quando a definição do formulário muda (nova versão), os valores são resetados para `initialValues`
- Isso garante que mudanças na estrutura do formulário não causem inconsistências

### Validação em Tempo Real

- A validação ocorre automaticamente a cada mudança de campo
- Erros são exibidos imediatamente abaixo do campo
- Erros são limpos quando o usuário começa a corrigir o campo

### Campos Condicionais

- Campos condicionais são reavaliados sempre que os valores mudam
- Campos ocultos não são validados (mesmo se `required: true`)
- Campos ocultos não aparecem no objeto de valores

### Tratamento de Valores Vazios

- **Text**: string vazia `''` se não preenchido
- **Number**: `null` se não preenchido
- **Boolean**: `false` se não marcado
- **Select**: string vazia `''` se não selecionado
- **Multiselect**: array vazio `[]` se nenhuma opção selecionada

## Exemplo Completo

```json
{
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Nome completo",
      "name": "fullName",
      "required": true,
      "placeholder": "Digite seu nome",
      "maxLength": 100
    },
    {
      "id": "age",
      "type": "number",
      "label": "Idade",
      "name": "age",
      "required": true,
      "min": 0,
      "max": 120
    },
    {
      "id": "hasSymptoms",
      "type": "boolean",
      "label": "Você tem sintomas?",
      "name": "hasSymptoms",
      "required": false
    },
    {
      "id": "symptoms",
      "type": "multiselect",
      "label": "Quais sintomas?",
      "name": "symptoms",
      "required": true,
      "options": [
        { "label": "Febre", "value": "fever" },
        { "label": "Tosse", "value": "cough" },
        { "label": "Dor de cabeça", "value": "headache" }
      ],
      "conditions": [
        {
          "fieldId": "hasSymptoms",
          "operator": "equals",
          "value": true
        }
      ]
    },
    {
      "id": "feverDetail",
      "type": "text",
      "label": "Temperatura (se febre)",
      "name": "feverTemperature",
      "required": false,
      "conditions": [
        {
          "fieldId": "symptoms",
          "operator": "contains",
          "value": "fever"
        }
      ]
    }
  ]
}
```

## Checklist para Implementação React Native/Expo

- [ ] Criar componente `FormRenderer` que aceita `definition` e `onChange`
- [ ] Implementar renderização para cada tipo de campo:
  - [ ] Text (TextInput)
  - [ ] Number (TextInput com keyboardType="numeric")
  - [ ] Boolean (Switch ou Checkbox)
  - [ ] Select (Picker ou Modal com lista)
  - [ ] Multiselect (Modal com lista e checkboxes)
- [ ] Implementar sistema de validação:
  - [ ] Validação de campos obrigatórios
  - [ ] Validação de min/max para números
  - [ ] Validação de maxLength para texto
  - [ ] Exibição de mensagens de erro
- [ ] Implementar sistema de condições:
  - [ ] Função para avaliar condições
  - [ ] Ocultar/mostrar campos dinamicamente
  - [ ] Reavaliar condições quando valores mudam
- [ ] Gerenciar estado dos valores do formulário
- [ ] Implementar callback `onChange` que retorna valores + `_isValid`
- [ ] Resetar valores quando definição mudar
- [ ] Suportar `initialValues` para pré-preencher campos
- [ ] Suportar `readOnly` para modo somente leitura

## Notas Finais

- A definição do formulário é armazenada como JSON no backend (campo `definition` da tabela `form_version`)
- O formato é flexível e permite adicionar novos tipos de campos no futuro
- O sistema de condições permite criar formulários complexos e dinâmicos
- A validação é client-side; o backend também deve validar os dados recebidos
- O campo `_isValid` é uma convenção do frontend e não deve ser enviado ao backend

