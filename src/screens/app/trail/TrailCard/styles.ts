import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: { 
    padding: 20,
    paddingBottom: 20
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  completedCard: {
    borderColor: '#3b82f6', // Tom de azul
    borderWidth: 2,         // Borda um pouco mais grossa para destaque
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  cycleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4b5563',
    textTransform: 'uppercase'
  },
  dates: {
    fontSize: 14,
    color: '#9ca3af'
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6
  },
  trackDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  fadedCard: {
    opacity: 0.6,
    backgroundColor: '#f9fafb'
  },
  closedText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    fontWeight: 'bold'
  },
});