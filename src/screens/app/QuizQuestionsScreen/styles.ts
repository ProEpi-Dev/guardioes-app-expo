import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scalling';
import { colors } from '../../../utils/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Cabeçalho alinhado ao Figma
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  trailTitle: {
    fontSize: scale(18),
    color: colors.secundaria,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressText: {
    fontSize: scale(15),
    fontWeight: 'bold',
    color: colors.secundaria,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    width: '80%',
    borderRadius: 3,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secundaria,
    borderRadius: 3,
  },
  timerText: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: '#D32F2F',
    marginTop: 12,
  },

  contentContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },

  // Rodapé e Botões
  footer: {
    paddingHorizontal: 20,
    paddingTop: 5,
    backgroundColor: '#FFF',
    gap: 12,
  },
  actionButtonContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  actionButtonText: { color: '#FFF', fontSize: scale(15), fontWeight: 'bold' },
  disabledButton: { opacity: 0.6 },
});
