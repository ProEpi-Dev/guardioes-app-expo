import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 22,
        paddingHorizontal: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderWidth: 1.5,
    },
    completedCard: {
        borderColor: '#4CAF50', 
    },
    expiredCard: {
        borderColor: '#9CA3AF',
    },
    lockedCard: {
        borderColor: '#E5E7EB', 
        elevation: 1, 
        shadowOpacity: 0.04,
    },
    activeCard: {
        borderColor: colors.secundaria, 
    },
    iconContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.secundaria,
        textAlign: 'center',
        lineHeight: 22,
    },
    description: {
        fontSize: 13,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 18,
    },
    lockedText: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 8,
        fontWeight: '600',
        textAlign: 'center',
    },
    closedText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyRightSpace: {
        width: 30, 
    },
    upcomingCard: {
        borderColor: '#F59E0B',
        backgroundColor: '#FFFBEB',
    },
    upcomingText: {
        fontSize: 12,
        color: '#D97706',
        marginTop: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    deadlineText: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 8,
        fontWeight: '600',
        textAlign: 'center',
    },
});