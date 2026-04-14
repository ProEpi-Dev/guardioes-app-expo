# Guardiões da Saúde

O aplicativo **Guardiões da Saúde** é uma ferramenta de vigilância participativa e educação em saúde. Este projeto é desenvolvido utilizando **React Native** e **Expo**, com suporte a **TypeScript**.

## Tecnologias Principais

- **Framework:** React Native + Expo
- **Linguagem:** TypeScript / JavaScript
- **Navegação:** React Navigation v6 (Stack, Drawer, BottomTabs)
- **Requisições HTTP:** Axios
- **Internacionalização (i18n):** `i18next` com suporte para PT, EN e ES.
- **Gerenciamento de Estado Global:** Context API

## Configuração do Ambiente e Execução

### Pré-requisitos

- Node.js instalado (versão recomendada: 16+ ou a especificada para o Expo)
- Yarn ou npm instalado
- Emulador Android/iOS.

### Passos

1. **Clone o repositório e entre na pasta do projeto:**

   ```bash
   git clone https://github.com/ProEpi-Dev/guardioes-app-expo.git
   cd guardioes-app-expo
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configuração de Variáveis de Ambiente:**
   - Crie um arquivo `.env` na raiz do projeto copiando a estrutura do `.env.example`.
   - Adicione a chave do Google Maps.

4. **Inicie a aplicação:**
   - Android:

   ```bash
   npm run android
   ```

   - iOS:

   ```bash
   npm run ios
   ```

## Estrutura de Documentação Adicional

Para entender melhor o sistema, consulte os arquivos abaixo na pasta `/docs` (ou crie-os seguindo a documentação detalhada):

- [Estrutura e Arquitetura do Projeto](./docs/ESTRUTURA.md)
- [Sistema de Navegação](./docs/NAVEGACAO.md)
- [Funcionalidades e Componentes Chave](./docs/COMPONENTES.md)
