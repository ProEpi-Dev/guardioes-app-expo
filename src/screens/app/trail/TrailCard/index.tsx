import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Text, View, TouchableOpacity } from 'react-native';
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

    const handlePress = (item: TrackCycle) => {
        // Bloqueia Draft e Archived
        if (item.status === 'draft' || item.status === 'archived') {
            return;
        }

        // Navega passando a flag de expirado
        navigation.navigate('Accordion', { 
            cycleId: item.id, 
            title: item.name,
            isCycleExpired: !!item.isClosed // Passamos para o Accordion saber se mostra alertas
        });
    };

    const renderItem = useCallback(({ item, index }: { item: TrackCycle, index: number }) => {
        const previousItem = index > 0 ? cycles[index - 1] : null;
        const shouldShowHeader = index === 0 || item.name !== previousItem?.name;

        const isCompleted = item.user_status === 'completed';
        const percentage = item.progress_percentage || 0;
        
        // Verifica se deve ficar "apagado" (closed ou expired)
        const isFaded = item.isClosed; 
        
        // Verifica se é completamente inacessível (apenas visual, ou removido da lista se preferir)
        const isDisabled = item.status === 'draft' || item.status === 'archived';

        if (isDisabled) return null; // Opcional: Não renderiza rascunhos

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
                    style={[
                        styles.cardContainer, 
                        isCompleted && styles.completedCard,
                        isFaded && styles.fadedCard // Aplica opacidade
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handlePress(item)}
                    disabled={isDisabled}
                >
                    <View style={styles.contentRow}>
                        <View style={styles.trackInfo}>
                            <Text style={styles.trackTitle}>{item.track.name}</Text>
                            <Text style={styles.trackDescription} numberOfLines={3}>
                                {item.track.description}
                            </Text>
                            {/* Opcional: Texto indicando encerrado */}
                            {isFaded && !isCompleted && (
                                <Text style={styles.closedText}>Prazo encerrado</Text>
                            )}
                        </View>

                        <View style={styles.percentageContainer}>
                            <Text style={[
                                styles.percentageText, 
                                isCompleted && { color: '#3b82f6' } // Azul se completo
                            ]}>
                                {Math.round(percentage)}%
                            </Text>
                        </View>
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