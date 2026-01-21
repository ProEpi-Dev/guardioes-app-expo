import { StyleSheet } from "react-native";
import { scale } from "../../utils/scalling";

export const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  questionIndex: { fontSize: scale(12), fontWeight: 'bold', color: '#999' },
  questionTitle: { fontSize: scale(16), color: '#333', marginBottom: 12, fontWeight: '500' },
  
  answerContainer: { flexDirection: 'row', marginBottom: 4, flexWrap: 'wrap' },
  label: { fontWeight: 'bold', color: '#555', marginRight: 6 },
  answerText: { flex: 1 },

  feedbackBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 6,
  },
  feedbackText: { fontSize: scale(14), fontStyle: 'italic' },
});