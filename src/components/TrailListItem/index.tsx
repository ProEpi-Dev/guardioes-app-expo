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
    const isUpcoming = item.isUpcoming;
    const isExpired = item.isExpired && !isCompleted && !isLocked && !isUpcoming;
    const isActive = !isCompleted && !isLocked && !isUpcoming && !isExpired;

    const getIcon = () => {
        if (isCompleted) {
            return <MaterialCommunityIcons name="check-circle-outline" size={24} color="#4CAF50" />;
        }
        if (isLocked) {
            return <Feather name="lock" size={22} color="#D1D5DB" />;
        }
        if (isUpcoming) {
            return <MaterialCommunityIcons name="clock-outline" size={24} color="#F59E0B" />;
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
        isUpcoming ? styles.upcomingCard :
        isExpired ? styles.expiredCard :
        styles.activeCard,
        isExpired && { opacity: 0.6 } 
    ];
    const isButtonDisabled = isLocked || isUpcoming;

    return (
        <TouchableOpacity
            style={cardStyle}
            onPress={() => onPress(item)}
            disabled={isButtonDisabled}
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

                {isUpcoming && !item.isMandatoryLock && (
                    <Text style={styles.upcomingText}>
                        {/* Disponível em: {item.displayStartDate} */}
                        Em breve
                    </Text>
                )}

                {isExpired && !isUpcoming && !item.isMandatoryLock && (
                    <Text style={styles.closedText}>
                        Prazo encerrado{item.displayEndDate ? ` em: ${item.displayEndDate}` : ''}
                    </Text>
                )}

                {isActive && item.displayEndDate && (
                    <Text style={styles.deadlineText}>
                        Prazo final: {item.displayEndDate}
                    </Text>
                )}
            </View>

            <View style={styles.emptyRightSpace} />
        </TouchableOpacity>
    );
}