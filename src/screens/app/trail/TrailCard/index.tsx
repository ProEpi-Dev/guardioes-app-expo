import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { RootTrailParamList } from '../../../../types/trail';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrails } from '../../../../hooks/useTrail';
import { Trail } from '../../../../types/trail';
import ArticleCard from '../../../../components/ArticleCard';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootTrailParamList, 'Home'>;

export default function TrailCard({navigation}: Props) {
    const { trails, isLoading, isRefreshing, handleRefresh, error } = useTrails();
    console.log(trails)

    const renderItem = useCallback(({item}: {item: Trail}) => (
        <ArticleCard
            title={item.name}
            summary={item.description}
            onPress={() => Alert.alert("Funcionou")}
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
            data={trails}
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