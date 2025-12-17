import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/article';
import { ArticleWebView } from '../../../components/ArticleWebView';
import YoutubePlayer from 'react-native-youtube-iframe';

type Props = NativeStackScreenProps<RootStackParamList, 'Article'>;

export default function ArticleScreen({ route }: Props) {
  const { article } = route.params;

  return (
    <>
      <ArticleWebView
        title={article.title}
        image={article.image}
        content={article.content}
      />
      <YoutubePlayer
        height={220}
        play={false}
        videoId="3IcyRLeZDIs"
      />
    </>
  );
}