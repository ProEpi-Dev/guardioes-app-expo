import { StyleSheet } from 'react-native';
import { scale } from '../../utils/scalling';
import { colors } from '../../utils/colors';

export const styles = StyleSheet.create({
  headerResult: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quizTitle: {
    fontSize: scale(18),
    fontWeight: '500',
    color: colors.secundaria,
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreValue: { fontSize: scale(28), fontWeight: 'bold' },
  scoreLabel: { fontSize: scale(13), color: '#888', marginTop: 4 },

  statusButtonContainer: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 17,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  statusText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scale(14),
  },
});
