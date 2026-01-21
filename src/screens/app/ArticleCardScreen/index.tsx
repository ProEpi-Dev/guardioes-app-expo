import React, { useCallback } from 'react';
import { FlatList, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ArticleCard from '../../../components/ArticleCard';
import { RootStackParamList, Article } from '../../../types/article';
import { useArticles } from '../../../hooks/useArticles';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function ArticleListScreen({ navigation }: Props) {
  const { articles, isLoading, isRefreshing, handleRefresh, error } = useArticles();

  const renderItem = useCallback(({ item }: { item: Article }) => (
    <ArticleCard
      title={item.title}
      summary={item.summary}
      onPress={() => navigation.navigate('Article', { article: item })}
    />
  ), [navigation]);

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={articles}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.contentContainer}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
      ListEmptyComponent={<Text style={styles.emptyText}>Nenhum artigo encontrado.</Text>}
    />
  );
}
