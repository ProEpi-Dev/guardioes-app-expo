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
      title: 'O que é React Native?',
      image: 'https://picsum.photos/200',
      content: 'Texto completo do artigo sobre React Native aqui...'
    },
    {
      id: 2,
      title: 'Começando com Expo',
      image: 'https://picsum.photos/201',
      content: 'Texto completo sobre Expo...'
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
          onPress={() => navigation.navigate('Article', { article })}
        />
      ))}
    </ScrollView>
  );
}