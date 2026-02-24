import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/article';
import { ArticleWebView } from '../../../components/ArticleWebView';
import { CustomHeader } from '../../../components/CustomHeader';
import { useAuth } from '../../../contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Article'>;

export default function ArticleScreen({ route }: Props) {
  const { user } = useAuth();
  const { article } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <>
      <CustomHeader userName={user?.name} showBackButton={true}/>
      <View style={{ flex: 1, paddingBottom: insets.bottom + 90 }}>
        <ArticleWebView
          content={article.content}
        />
      </View>
    </>
  );
}