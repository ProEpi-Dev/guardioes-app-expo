import { StyleSheet } from "react-native";
import { scale } from "../../utils/scalling";

export const styles = StyleSheet.create({
  headerResult: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  quizTitle: { fontSize: scale(18), fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreValue: { fontSize: scale(29), fontWeight: 'bold' },
  scoreLabel: { fontSize: scale(12), color: '#666' },
  
  statusText: {
    color: '#FFF',
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: scale(14),
  }
});