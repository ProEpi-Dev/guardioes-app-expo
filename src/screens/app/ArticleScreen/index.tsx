import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/article';
import { ArticleWebView } from '../../../components/ArticleWebView';
import { CustomHeader } from '../../../components/CustomHeader';
import { useAuth } from '../../../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Article'>;

export default function ArticleScreen({ route }: Props) {
  const { user } = useAuth();
  const { article } = route.params;

  return (
    <>
      <CustomHeader userName={user?.name} showBackButton={true}/>
      <ArticleWebView
        content={article.content}
      />
    </>
  );
}