import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/article';
import { ArticleWebView } from '../../../components/ArticleWebView';

type Props = NativeStackScreenProps<RootStackParamList, 'Article'>;

export default function ArticleScreen({ route }: Props) {
  const { article } = route.params;

  return (
    <>
      <ArticleWebView
        content={article.content}
      />
    </>
  );
}