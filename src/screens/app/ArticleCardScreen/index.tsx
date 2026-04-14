import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ArticleCard from '../../../components/ArticleCard';
import { RootStackParamList, Article } from '../../../types/article';
import { useArticles } from '../../../hooks/useArticles';
import { styles } from './styles';
import { useAuth } from '../../../contexts/AuthContext';
import { CustomHeader } from '../../../components/CustomHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../utils/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilterDrawer } from '../../../components/FilterDrawer';
import { Feather } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function ArticleListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const {
    articles,
    contentTypes,
    isLoading,
    isRefreshing,
    handleRefresh,
    error,
  } = useArticles();

  const insets = useSafeAreaInsets();
  const bottomBarHeight = 60 + insets.bottom;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  const filteredArticles = useMemo(() => {
    if (selectedFilters.length === 0) {
      return articles;
    }
    return articles.filter(
      (article) =>
        article.content_type &&
        selectedFilters.includes(article.content_type.id)
    );
  }, [articles, selectedFilters]);

  const toggleFilter = (id: number) => {
    setSelectedFilters((prev) =>
      prev.includes(id)
        ? prev.filter((filterId) => filterId !== id)
        : [...prev, id]
    );
  };

  const clearFilters = () => setSelectedFilters([]);

  const renderItem = useCallback(
    ({ item }: { item: Article }) => (
      <ArticleCard
        title={item.title}
        summary={item.summary}
        thumbnail_url={item.thumbnail_url}
        onPress={() => navigation.navigate('Article', { article: item })}
      />
    ),
    [navigation]
  );

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
    <>
      <CustomHeader userName={user?.name} />

      <View style={styles.botaoFiltro}>
        <TouchableOpacity
          style={styles.actionButtonContainer}
          onPress={() => setIsDrawerOpen(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.azulClaro, colors.azulEscuro]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButtonGradient}
          >
            <Feather name="filter" size={24} color="white" />
            <Text style={styles.actionButtonText}>
              Filtro{' '}
              {selectedFilters.length > 0 ? `(${selectedFilters.length})` : ''}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        data={filteredArticles}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: bottomBarHeight + 10 },
        ]}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum artigo encontrado.</Text>
        }
      />

      <FilterDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        contentTypes={contentTypes}
        selectedFilters={selectedFilters}
        onToggleFilter={toggleFilter}
        onClearFilters={clearFilters}
      />
    </>
  );
}
