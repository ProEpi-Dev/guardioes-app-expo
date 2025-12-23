import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ArticleCard from '../../../components/ArticleCard';
import { Article } from '../../../types/article';
import { RootStackParamList } from '../../../types/article';
import { apiClient } from '../../../utils/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function ArticleCardScreen({ navigation }: Props) {
  const [content, setContent] = useState<Article[]>([]);
  useEffect(() => {
    const card = async() => {
      const usersResponse = await apiClient(
        '/v1/contents',
        { method: 'GET' }
      ) as any;
      setContent(usersResponse);
    };
    card()
  }, []);

  return (
    <FlatList
      style={{ flex: 1 }}
      data={content}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ArticleCard
          title={item.title}
          summary={item.summary}
          onPress={() => navigation.navigate('Article', { article: item })}
        />
      )}
      contentContainerStyle={{ 
        padding: 20,
        paddingBottom: 0
      }}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
    />
  );
}