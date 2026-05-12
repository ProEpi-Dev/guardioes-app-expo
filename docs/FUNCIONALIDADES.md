# Funcionalidades Implementadas

Este documento tem como objetivo apresentar todas as funcionalidades implementadas no aplicativo **Guardiões da Saúde**.

## Tela Inicial

### Funcionalidades em comum (VBE e VBC)

1. **Botões de Reporte:** Botões responsáveis por informar ao servidor que nada aconteceu ou que o usuário está bem, além de permitir a abertura do formulário flexível.
2. **Formulário Flexível:** Responsável por renderizar o formulário mais recente para preenchimento e enviar as respostas para o console administrativo.

### Funcionalidades exclusivas (VBC)

1. **Mapa com Sintomas:** Exibição de um mapa com marcadores coloridos (verde e vermelho), baseado nos sintomas de bem ou mal-estar reportados pelos usuários nos últimos 7 dias.

### Funcionalidades exclusivas (VBE)

1. **Listagem de Sinais:** Exibe uma listagem em formato de _cards_ com informações resumidas sobre o sinal reportado pelo líder comunitário. Ao tocar em um _card_, abre-se um modal que apresenta informações detalhadas.
2. **Modal:** Mostra as informações completas do sinal reportado, bem como o seu _status_.
3. **Filtro por Status:** Abre opções de filtro para facilitar a busca por um reporte de sinal específico.

## Tela Dias

1. **Calendário:** Exibe um calendário que informa em quais dias houve um reporte.
2. **Contadores de Tempo:** Mostram quantos reportes já foram realizados e a quantidade máxima de dias seguidos informando o estado de saúde.

## Tela Aprenda

1. **Cards de Trilhas:** Mostram o nome da trilha e abrem o caminho completo de uma trilha ao serem pressionados.
2. **Tela com Caminhos:** Exibe a sequência de conteúdos que devem ser realizados em ordem. Nessa sequência, há conteúdos e _quizzes_.
3. **Conteúdos:** Exibem materiais informativos relevantes para a conclusão da trilha.
4. **Quizzes:** Primeiramente, é exibida uma tela com as informações necessárias para a realização do questionário. Em seguida, inicia-se o teste com a identificação das respostas certas e erradas após cada questão, contando com um cronômetro decrescente. Ao final, apresenta-se uma tela de resumo com as respostas de cada questão e o desempenho final do usuário.

## Tela Conteúdo

1. **Cards de Conteúdo:** Exibem o nome, o _banner_ e o resumo do conteúdo.
2. **Visualização do Conteúdo:** Ao abrir um conteúdo, o material é mostrado na íntegra.

## Tela Perfil

1. **Edição de Informações:** Possibilita que o usuário altere as informações preenchidas no momento do cadastro.

## Telas de Autenticação e Cadastro

- **Tela de Login (Autenticação no App):** Permite que o usuário informe um e-mail e uma senha válidos para usar o aplicativo.
- **Tela de Cadastro (Cadastro no App):** Permite que o usuário crie uma conta no aplicativo, baseando-se no contexto em que ele está inserido.
- **Tela de Recuperação de Senha (Recuperar Senha):** Permite que o usuário recupere a senha da sua conta ao informar o e-mail cadastrado no aplicativo.
- **Tela de Confirmação de E-mail (Validação de E-mail):** Tela obrigatória que aparece assim que o usuário realiza o cadastro, garantindo que um e-mail inexistente não seja cadastrado no aplicativo.

## Tela Informações Complementares

1. **Informações Complementares:** Campos personalizados para preenchimento que dependem do contexto selecionado pelo usuário.
