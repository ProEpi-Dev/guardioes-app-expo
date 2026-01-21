import { StyleSheet } from "react-native";
import { scale } from "../../../utils/scalling";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  progressText: { fontSize: scale(14), fontWeight: '600', color: '#666' },
  timerText: { fontSize: scale(14), fontWeight: 'bold', color: '#0000ff', marginTop: 2 },
  progressBarBg: { height: 4, backgroundColor: '#E0E0E0', width: '100%' },
  progressBarFill: { height: '100%', backgroundColor: '#0000ff' },
  contentContainer: { flex: 1, padding: 20 },
  resultText: { fontWeight: 'bold', fontSize: scale(16) },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  actionButton: {
    backgroundColor: '#0000ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
  },
  disabledButton: { backgroundColor: '#CCC' },
  actionButtonText: { color: '#FFF', fontSize: scale(16), fontWeight: 'bold' },
  resultBanner: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 5,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  resultTitle: { 
    fontWeight: 'bold', 
    fontSize: scale(16) 
  },
  feedbackText: {
    fontSize: scale(14),
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 4,
    marginLeft: 34,
  },
  correctAnswerText: {
    fontSize: scale(12), 
    color: '#666', 
    marginTop: 4,
    marginLeft: 34,
    fontWeight: '600'
  },
});