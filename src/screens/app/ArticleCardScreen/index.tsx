import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import ArticleCard from '../../../components/ArticleCard';
import { RootStackParamList, Article } from '../../../types/article';
import { useArticles } from '../../../hooks/useArticles';
import { styles } from './styles';
import { useAuth } from '../../../contexts/AuthContext';
import { CustomHeader } from '../../../components/CustomHeader';
import { colors } from '../../../utils/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import translate from '../../../locales/i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  texto: 'file-text',
  video: 'video',
  audio: 'headphones',
};

const normalize = (text?: string) =>
  (text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

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

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      return () => setSelectedId(null);
    }, [])
  );

  const selectedType = useMemo(
    () => contentTypes.find((type) => type.id === selectedId),
    [contentTypes, selectedId]
  );

  // true quando a API não retornou nenhum artigo
  const hasNoArticles = !articles?.length;

  const filteredArticles = useMemo(() => {
    if (selectedId === null || !articles) return [];
    return articles.filter(
      (article) => article.content_type?.id === selectedId
    );
  }, [articles, selectedId]);

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

      {selectedType ? (
        <View style={styles.selectedFilterContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedId(null)}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={28} color={colors.secundaria} />
          </TouchableOpacity>
          <Text style={styles.selectedFilterText}>{selectedType.name}</Text>
          <View style={styles.backButtonSpacer} />
        </View>
      ) : (
        <View style={styles.filterButtonsContainer}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name={'file-document-multiple-outline'}
              size={36}
              color={colors.secundaria}
            />
            <Text style={styles.textTitle}>Conteúdos</Text>
          </View>
          {!hasNoArticles &&
            contentTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.filterButton}
                onPress={() => setSelectedId(type.id)}
                activeOpacity={0.8}
              >
                <Feather
                  name={ICONS[normalize(type.name)] ?? 'file'}
                  size={22}
                  color={colors.secundaria}
                />
                <Text style={styles.filterButtonText}>{type.name}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}

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
          selectedId !== null || hasNoArticles ? (
            <Text style={styles.emptyText}>
              {translate('articleCard.empty')}
            </Text>
          ) : null
        }
      />
    </>
  );
}
