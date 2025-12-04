import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';

interface Props {
  title: string;
  image: string;
  onPress: () => void;
}

export default function ArticleCard({ title, image, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});