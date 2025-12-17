import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ArticleCard from '../../../components/ArticleCard';
import { Article } from '../../../types/article';
import { RootStackParamList } from '../../../types/article';
import { apiClient } from '../../../utils/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function ArticleCardScreen({ navigation }: Props) {
  const [content, setcontent] = useState<Article[]>([]);
  useEffect(() => {
    const card = async() => {
      const usersResponse = await apiClient(
        '/v1/contents',
        { method: 'GET' }
      ) as any;
      setcontent(usersResponse);
    };
    card()
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      {content.map(article => (
        <ArticleCard
          key={article.id}
          title={article.title}
          onPress={() => navigation.navigate(article.id === 2 ? 'Artigo' : 'Article', { article })}
        />
      ))}
    </ScrollView>
  );
}