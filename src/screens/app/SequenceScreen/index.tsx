import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { CustomHeader } from '../../../components/CustomHeader'; 
import { useAuth } from '../../../contexts/AuthContext'; 
import { useStreaks } from '../../../hooks/useStreaks'; 
import { StatCard } from '../../../components/StatCard';
import { StreakCalendar } from '../../../components/StreakCalendar';

export function SequenceScreen() {
    const { user } = useAuth();
    const contextId = 1; 
    const participationId = 5; 
    const tabBarHeight = useBottomTabBarHeight();

    const { currentStreak, longestStreak, totalReports, markedDates, loading, fetchMonthData } = useStreaks(contextId, participationId);

    const textoDia = currentStreak === 1 ? 'dia' : 'dias';
    const textoSeguido = currentStreak === 1 ? 'seguido' : 'seguidos';

    return (
        <View style={styles.container}>
            <CustomHeader userName={user?.name} />

            <ScrollView 
                contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 20 }]} 
                showsVerticalScrollIndicator={false}
            >
                
                <View style={styles.messageCard}>
                    <Text style={styles.messageText}>
                        Você participou por <Text style={styles.messageHighlight}>{currentStreak} {textoDia}</Text> {textoSeguido}.
                    </Text>
                </View>

                <StreakCalendar 
                    markedDates={markedDates}
                    loading={loading}
                    onMonthChange={fetchMonthData}
                />

                <View style={styles.statsContainer}>
                    <StatCard label="Maior Sequência" value={`${longestStreak || 0} 🏆`} />
                    <StatCard label="Total de Dias" value={`${totalReports || 0} 📅`} />
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    messageCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    messageText: {
        fontSize: 18,
        color: '#4A5568',
        textAlign: 'center',
    },
    messageHighlight: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#2C3E50',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
});