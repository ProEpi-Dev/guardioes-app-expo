import { StyleSheet } from 'react-native';
import { scale } from '../../utils/scalling';
import { colors } from '../../utils/colors';

export const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    elevation: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questionIndex: { fontSize: scale(14), fontWeight: '600', color: '#777' },
  questionTitle: {
    fontSize: scale(14),
    color: colors.secundaria,
    marginBottom: 16,
    fontWeight: '500',
    lineHeight: 20,
  },

  answerContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  label: { fontSize: scale(13), color: '#888', marginRight: 6 },
  answerText: { fontSize: scale(13), fontWeight: 'bold' },

  feedbackBox: { marginTop: 12, padding: 10, borderRadius: 6 },
  feedbackText: { fontSize: scale(13), fontStyle: 'italic' },
});
