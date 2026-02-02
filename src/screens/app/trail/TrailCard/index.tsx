import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTrailParamList, TrackCycle } from '../../../../types/trail';
import { useTrails } from '../../../../hooks/useTrail';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootTrailParamList, 'Home'>;

export default function TrailCard({navigation}: Props) {
    const { cycles, isLoading, isRefreshing, handleRefresh, error } = useTrails();

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const renderItem = useCallback(({ item, index }: { item: TrackCycle, index: number }) => {
        const previousItem = index > 0 ? cycles[index - 1] : null;
        const shouldShowHeader = index === 0 || item.name !== previousItem?.name;

        return (
            <View>
                {shouldShowHeader && (
                    <View style={styles.header}>
                        <Text style={styles.cycleName}>{item.name}</Text>
                        <Text style={styles.dates}>
                            {formatDate(item.start_date)} - {formatDate(item.end_date)}
                        </Text>
                    </View>
                )}
                
                <TouchableOpacity 
                    style={styles.cardContainer}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Accordion', { cycleId: item.id, title: item.name })}
                >
                    <View style={styles.trackInfo}>
                        <Text style={styles.trackTitle}>{item.track.name}</Text>
                        <Text style={styles.trackDescription} numberOfLines={3}>
                            {item.track.description}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }, [navigation, cycles]);

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
            data={cycles}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum ciclo encontrado para seu contexto.</Text>}
        />
    );
}