import React from 'react';
import { ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ArticleCard from '../../../components/ArticleCard';
import { Article } from '../../../types/article';
import { RootStackParamList } from '../../../types/article';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function ArticleCardScreen({ navigation }: Props) {
  const articles: Article[] = [
    {
      id: 1,
      title: 'Youtube Integrado',
      image: 'https://picsum.photos/200',
      content: `
        <h1>Guia Completo de Desenvolvimento Mobile em 2025</h1>

        <p>
          O desenvolvimento mobile evoluiu muito nos últimos anos. Neste artigo veremos
          as principais tendências, ferramentas e práticas mais modernas. O objetivo é ser
          um guia completo para iniciantes e profissionais.
        </p>

        <img 
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC"
          alt="React Logo"
          style="width: 100%; max-width: 300px; display: block; margin: 20px auto;"
        />

        <h2>Principais Tendências</h2>
        <ul>
          <li>Aplicativos híbridos mais eficientes</li>
          <li>Integração com IA generativa</li>
          <li>Automação de build e deploy com pipelines inteligentes</li>
          <li>Componentes nativos otimizados</li>
        </ul>

        <h2>Stack Recomendado</h2>
        <ol>
          <li>React Native</li>
          <li>TypeScript</li>
          <li>Expo (opcional)</li>
          <li>Jest + Detox para testes</li>
        </ol>

        <h2>Exemplo de Código</h2>
        <pre>
        <code>
    function HelloWorld() {
      return &lt;Text&gt;Hello, mundo do React Native!&lt;/Text&gt;;
    }
        </code>
        </pre>

        <h2>Tabela de Frameworks</h2>
        <table border="1" cellpadding="6" style="border-collapse: collapse; width: 100%; text-align: left;">
          <tr>
            <th>Framework</th>
            <th>Linguagem</th>
            <th>Performance</th>
          </tr>
          <tr>
            <td>React Native</td>
            <td>JavaScript</td>
            <td>Alta</td>
          </tr>
          <tr>
            <td>Flutter</td>
            <td>Dart</td>
            <td>Muito Alta</td>
          </tr>
        </table>

        <h2>Nota Importante</h2>
        <blockquote>
          “A escolha do framework deve considerar a equipe, o ecossistema e o projeto.”
        </blockquote>

        <p>
          Para saber mais, visite:
          <a href="https://reactnative.dev">Site oficial do React Native</a>
        </p>

        <p>
          E lembre-se: <mark>aprendizado contínuo é essencial!</mark>
        </p>
      `
    },
    {
      id: 2,
      title: 'O que é React Native (Webview)?',
      image: 'https://picsum.photos/200',
      content: `
        <h1>Guia Completo de Desenvolvimento Mobile em 2025</h1>

        <p>
          O desenvolvimento mobile evoluiu muito nos últimos anos. Neste artigo veremos
          as principais tendências, ferramentas e práticas mais modernas. O objetivo é ser
          um guia completo para iniciantes e profissionais.
        </p>

        <img 
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC"
          alt="React Logo"
          style="width: 100%; max-width: 300px; display: block; margin: 20px auto;"
        />

        <h2>Principais Tendências</h2>
        <ul>
          <li>Aplicativos híbridos mais eficientes</li>
          <li>Integração com IA generativa</li>
          <li>Automação de build e deploy com pipelines inteligentes</li>
          <li>Componentes nativos otimizados</li>
        </ul>

        <h2>Stack Recomendado</h2>
        <ol>
          <li>React Native</li>
          <li>TypeScript</li>
          <li>Expo (opcional)</li>
          <li>Jest + Detox para testes</li>
        </ol>

        <h2>Exemplo de Código</h2>
        <pre>
        <code>
    function HelloWorld() {
      return &lt;Text&gt;Hello, mundo do React Native!&lt;/Text&gt;;
    }
        </code>
        </pre>

        <h2>Tabela de Frameworks</h2>
        <table border="1" cellpadding="6" style="border-collapse: collapse; width: 100%; text-align: left;">
          <tr>
            <th>Framework</th>
            <th>Linguagem</th>
            <th>Performance</th>
          </tr>
          <tr>
            <td>React Native</td>
            <td>JavaScript</td>
            <td>Alta</td>
          </tr>
          <tr>
            <td>Flutter</td>
            <td>Dart</td>
            <td>Muito Alta</td>
          </tr>
        </table>

        <h2>Nota Importante</h2>
        <blockquote>
          “A escolha do framework deve considerar a equipe, o ecossistema e o projeto.”
        </blockquote>

        <p>
          Para saber mais, visite:
          <a href="https://reactnative.dev">Site oficial do React Native</a>
        </p>

        <p>
          E lembre-se: <mark>aprendizado contínuo é essencial!</mark>
        </p>
      `
    },
    {
      id: 3,
      title: 'O que é React Native?',
      image: 'https://picsum.photos/200',
      content: 'Texto completo do artigo sobre React Native aqui...'
    },
    {
      id: 4,
      title: 'Começando com Expo',
      image: 'https://picsum.photos/201',
      content: 'Texto completo sobre Expo...'
    },
    {
      id: 5,
      title: 'O que é React Native?',
      image: 'https://picsum.photos/200',
      content: 'Texto completo do artigo sobre React Native aqui...'
    },
    {
      id: 6,
      title: 'Começando com Expo',
      image: 'https://picsum.photos/201',
      content: 'Texto completo sobre Expo...'
    },
    {
      id: 7,
      title: 'O que é React Native?',
      image: 'https://picsum.photos/200',
      content: 'Texto completo do artigo sobre React Native aqui...'
    },
    {
      id: 8,
      title: 'Começando com Expo',
      image: 'https://picsum.photos/201',
      content: 'Texto completo sobre Expo...'
    }
  ];

  return (
    <ScrollView style={{ padding: 20 }}>
      {articles.map(article => (
        <ArticleCard
          key={article.id}
          title={article.title}
          image={article.image}
          onPress={() => navigation.navigate(article.id === 2 ? 'Artigo' : 'Article', { article })}
        />
      ))}
    </ScrollView>
  );
}