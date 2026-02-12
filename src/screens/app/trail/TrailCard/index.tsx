import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Text, View, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTrailParamList, TrackCycle } from '../../../../types/trail';
import { useTrails } from '../../../../hooks/useTrail';
import { styles } from './styles';
import { CustomHeader } from '../../../../components/CustomHeader';
import { useAuth } from '../../../../contexts/AuthContext';
import { colors } from '../../../../utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootTrailParamList, 'Home'>;

export default function TrailCard({ navigation }: Props) {
    const { user } = useAuth(); 
    const { cycles, isLoading, isRefreshing, handleRefresh, error } = useTrails();

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const handlePress = useCallback((item: TrackCycle) => {
        console.log(item.isMandatoryLock);
        if (item.status === 'draft' || item.status === 'archived' || item.isMandatoryLock === true) {
            // if (item.isMandatoryLock) {
            //     Alert.alert(
            //         "Trilha Bloqueada", 
            //         "Você deve concluir a trilha obrigatória primeiro para liberar este conteúdo."
            //     );
            // }
            return;
        }

        navigation.navigate('Accordion', { 
            cycleId: item.id, 
            title: item.name,
            isCycleExpired: !!item.isClosed 
        });
    }, [navigation]);

    const renderItem = useCallback(({ item, index }: { item: TrackCycle, index: number }) => {
        const previousItem = index > 0 ? cycles[index - 1] : null;
        const shouldShowHeader = index === 0 || item.name !== previousItem?.name;

        const isCompleted = item.user_status === 'completed';
        const percentage = item.progress_percentage || 0;
        
        const isFaded = item.isClosed || item.isMandatoryLock;
        
        const isDisabled = item.status === 'draft' || item.status === 'archived';

        if (isDisabled) return null;

        return (
            <View>
                {/* {shouldShowHeader && (
                    <View style={styles.header}>
                        <Text style={styles.cycleName}>{item.name}</Text>
                        <Text style={styles.dates}>
                            {formatDate(item.start_date)} - {formatDate(item.end_date)}
                        </Text>
                    </View>
                )} */}
                
                <TouchableOpacity 
                    style={[
                        styles.cardContainer, 
                        isCompleted && styles.completedCard,
                        isFaded && styles.fadedCard 
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
                            
                            {item.isMandatoryLock && (
                                <Text style={[styles.closedText, { color: '#6b7280' }]}>
                                    Aguardando conclusão da trilha obrigatória
                                </Text>
                            )}

                            {item.isClosed && !isCompleted && !item.isMandatoryLock && (
                                <Text style={styles.closedText}>Prazo encerrado</Text>
                            )}
                        </View>

                        <View style={styles.percentageContainer}>
                            <Text style={[
                                styles.percentageText, 
                                isCompleted && { color: colors.green }
                            ]}>
                                {Math.round(percentage)}%
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }, [navigation, cycles, handlePress]);

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
            <View style={styles.title}>
                <MaterialCommunityIcons 
                    name={"chat-question-outline"} 
                    size={48} 
                    color={colors.secundaria} 
                />
                <Text style={styles.textTitle}>Aprenda</Text>
            </View>
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
        </>
    );
}