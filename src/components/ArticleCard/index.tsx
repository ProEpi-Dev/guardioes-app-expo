import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import { ArticleProps } from '../../types/article';
import { styles } from './styles';

export default function ArticleCard({
  title,
  summary,
  onPress,
  thumbnail_url,
  thumbnailUrl,
}: ArticleProps & {
  thumbnail_url?: string | null;
  thumbnailUrl?: string | null;
}) {
  const uri = thumbnail_url || thumbnailUrl;

  return (
    <TouchableOpacity
      style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {uri && <Image source={{ uri: uri }} style={styles.thumbnail} />}

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.summary}>{summary}</Text>
      </View>
    </TouchableOpacity>
  );
}
