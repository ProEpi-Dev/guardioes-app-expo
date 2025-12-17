import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/article';
import { ArticleWebView } from '../../../components/ArticleWebView';

type Props = NativeStackScreenProps<RootStackParamList, 'Artigo'>;

export function Artigo({ route }: Props) {
  const { article } = route.params;

  return (
    <ArticleWebView
      title={article.title}
      image={article.image}
      content={article.content}
    />
  );
}
