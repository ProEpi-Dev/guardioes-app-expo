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

type MCIName = keyof typeof MaterialCommunityIcons.glyphMap;

const ICONS: Record<string, MCIName> = {
  'boletim epidemiologico': 'clipboard-pulse-outline',
  noticia: 'newspaper-variant-outline',
  artigos: 'file-document-outline',
};

const ALL = 'all' as const;
const ALL_LABEL = 'Todos';

type SelectedFilter = number | typeof ALL | null;

const normalize = (text?: string) =>
  (text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

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

  const [selectedId, setSelectedId] = useState<SelectedFilter>(null);

  useFocusEffect(
    useCallback(() => {
      return () => setSelectedId(null);
    }, [])
  );

  const selectedName = useMemo(() => {
    if (selectedId === null) return null;
    if (selectedId === ALL) return ALL_LABEL;
    return contentTypes.find((type) => type.id === selectedId)?.name ?? null;
  }, [contentTypes, selectedId]);

  const hasNoArticles = !articles?.length;

  const filteredArticles = useMemo(() => {
    if (selectedId === null || !articles) return [];
    if (selectedId === ALL) return articles;
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

      {selectedName ? (
        <View style={styles.selectedFilterContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedId(null)}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={28} color={colors.secundaria} />
          </TouchableOpacity>
          <Text style={styles.selectedFilterText}>{selectedName}</Text>
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
          {!hasNoArticles && (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setSelectedId(ALL)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="view-grid-outline"
                size={22}
                color={colors.secundaria}
              />
              <Text style={styles.filterButtonText}>{ALL_LABEL}</Text>
            </TouchableOpacity>
          )}
          {!hasNoArticles &&
            contentTypes.map((type) => {
              const iconName = ICONS[normalize(type.name)];

              return (
                <TouchableOpacity
                  key={type.id}
                  style={styles.filterButton}
                  onPress={() => setSelectedId(type.id)}
                  activeOpacity={0.8}
                >
                  {iconName ? (
                    <MaterialCommunityIcons
                      name={iconName}
                      size={22}
                      color={colors.secundaria}
                    />
                  ) : null}
                  <Text style={styles.filterButtonText}>{type.name}</Text>
                </TouchableOpacity>
              );
            })}
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