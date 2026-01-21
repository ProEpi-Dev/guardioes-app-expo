import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import { ArticleProps } from '../../types/article';
import { styles } from './styles';


export default function ArticleCard({ title, summary, onPress }: ArticleProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.summary}>{summary}</Text>
      </View>
    </TouchableOpacity>
  );
}

