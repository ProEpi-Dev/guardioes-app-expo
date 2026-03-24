import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
    label: string;
    value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    statLabel: {
        fontSize: 13,
        color: '#A0AEC0',
        fontWeight: '600',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3748',
    },
});