import React from 'react';
import { TouchableOpacity, Text, View, StyleProp, ViewStyle } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { TrackCycle } from '../../types/trail';
import { colors } from '../../utils/colors';

interface TrailListItemProps {
    item: TrackCycle;
    onPress: (item: TrackCycle) => void;
}

export function TrailListItem({ item, onPress }: TrailListItemProps) {
    const isCompleted = item.user_status === 'completed';
    const isLocked = item.status === 'draft' || item.status === 'archived' || item.isMandatoryLock === true;
    
    const isExpired = item.isClosed && !isCompleted && !isLocked;

    const getIcon = () => {
        if (isCompleted) {
            return <MaterialCommunityIcons name="check-circle-outline" size={24} color="#4CAF50" />;
        }
        if (isLocked) {
            return <Feather name="lock" size={22} color="#D1D5DB" />;
        }
        if (isExpired) {
             return <MaterialCommunityIcons name="play-circle-outline" size={24} color="#9CA3AF" />;
        }
        return <MaterialCommunityIcons name="play-circle-outline" size={24} color={colors.secundaria} />;
    };

    const cardStyle: StyleProp<ViewStyle> = [
        styles.card,
        isCompleted ? styles.completedCard : 
        isLocked ? styles.lockedCard : 
        isExpired ? styles.expiredCard :
        styles.activeCard,
        isExpired && { opacity: 0.6 } 
    ];

    return (
        <TouchableOpacity
            style={cardStyle}
            onPress={() => onPress(item)}
            disabled={isLocked}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                {getIcon()}
            </View>
            
            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    Trilha: {item.track?.name || item.name}
                </Text>

                {item.track?.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {item.track.description}
                    </Text>
                )}

                {item.isMandatoryLock && (
                    <Text style={styles.lockedText}>
                        Aguardando conclusão da(s) trilha(s) obrigatória(s)
                    </Text>
                )}
                {isExpired && (
                    <Text style={styles.closedText}>
                        Prazo encerrado
                    </Text>
                )}
            </View>

            <View style={styles.emptyRightSpace} />
        </TouchableOpacity>
    );
}