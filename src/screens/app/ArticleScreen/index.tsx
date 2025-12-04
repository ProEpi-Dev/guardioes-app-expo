import React from 'react';
import { ScrollView, Text, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/article';

type Props = NativeStackScreenProps<RootStackParamList, 'Article'>;

export default function ArticleScreen({ route }: Props) {
  const { article } = route.params;

  return (
    <ScrollView style={{ padding: 20 }}>
      <Image 
        source={{ uri: article.image }} 
        style={{
          width: '100%',
          height: 200,
          borderRadius: 10,
          marginBottom: 20
        }}
      />

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {article.title}
      </Text>

      <Text style={{ fontSize: 18, lineHeight: 28 }}>
        {article.content}
      </Text>
    </ScrollView>
  );
}