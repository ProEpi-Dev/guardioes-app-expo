import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scalling';
import { colors } from '../../../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
  },

  headerTitles: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  trailTitle: {
    fontSize: scale(23),
    color: colors.secundaria,
    fontWeight: '500',
    textAlign: 'center',
  },
  separator: {
    width: 150,
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 10,
  },
  evaluationTitle: {
    fontSize: scale(19),
    color: colors.secundaria,
    fontWeight: 'bold',
  },

  instructionsContainer: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: colors.secundaria,
  },
  bulletsContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  instructionText: {
    fontSize: scale(14),
    color: colors.secundaria,
    lineHeight: 22,
    textAlign: 'left',
    marginBottom: 8,
  },

  attemptContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  orangeCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#FFA000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  orangeIcon: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: '#FFA000',
    fontStyle: 'italic',
  },
  attemptLabel: {
    fontSize: scale(14),
    color: '#888',
  },
  attemptNumber: {
    fontSize: scale(28),
    fontWeight: 'bold',
    color: '#FFA000',
    marginVertical: 2,
  },
  attemptSub: {
    fontSize: scale(13),
    color: '#888',
  },

  footer: {
    width: '100%',
    flexDirection: 'column',
    gap: 16,
  },
  secondaryButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: colors.secundaria,
  },
  secondaryButtonText: {
    color: colors.secundaria,
    fontWeight: 'bold',
    fontSize: scale(15),
  },

  primaryButtonContainer: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scale(15),
  },
});
