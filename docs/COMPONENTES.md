# Componentes e Lógicas Principais

O app *Guardiões da Saúde* tem features de mapeamento e questionários muito complexas. Abaixo listamos os principais componentes funcionais:

## 1. FormRenderer (`src/components/FormRenderer/`)
Um dos componentes mais críticos do projeto. A vigilância epidemiológica exige a criação constante de formulários de sintomas e pesquisas de campo estruturadas (`SnowForms`).
- **`FieldFactory.tsx`**: Padrão de projeto *Factory* responsável por ler uma definição em JSON vinda do Backend e transformá-la no campo visual correto (ex: `TextInput`, `Radio`, `Checkbox`, `CustomDatePicker`).
- Este componente se comunica pesadamente com o arquivo de tipagem `src/types/formRenderer.ts`.

## 2. Mapa Epidemiológico (`src/components/MapWithFeeling/`)
- Integra mapas do Google via `react-native-maps`.
- Permite renderizar pinos de usuários (clusters) que representam, por exemplo, o relato de sintomas em determinadas zonas geográficas (baseado em cores: *green-marker* para usuários sem sintomas, *red-marker* para com sintomas).
- Usa o plugin customizado do Expo listado na raiz (`plugins/withGoogleMapsApiKey.js`) para garantir o registro da API Key nos binários nativos de Android e iOS.

## 3. Gamificação e Trilhas (Trail & Quiz)
- O aplicativo suporta uma trilha de conteúdos interativos (como módulos de curso).
- O backend alimenta um estado lido pelos hooks `useTrail.ts` e `useQuizList.ts`.
- Componentes como `TrailListItem`, `QuizCard` e `ScoreHeader` ajudam a exibir o progresso do usuário no aprendizado das práticas de saúde e da doença avaliada.

## 4. Internacionalização (i18n)
Toda a aplicação possui as strings isoladas em `src/locales/`. 
Para alterar um texto no app, desenvolvedores não devem "hardcodar" strings, mas sim usar:
```javascript
import translate from '../../locales/i18n';

<Text style={styles.cardTitle}>
    {translate('home.userHowYouFelling')}
</Text>
```