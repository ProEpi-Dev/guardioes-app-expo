import { StyleSheet } from 'react-native';
import { colors } from '../../../../utils/colors';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAFAFA' }, // Fundo cinza clarinho melhora o destaque dos cards
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingVertical: 10, paddingBottom: 40 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' },
  
  trailHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  trailTitleText: {
    fontSize: 20,
    color: colors.secundaria,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  sectionContainer: { marginBottom: 24, paddingHorizontal: 16 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.secundaria, // Cor azul principal
    marginBottom: 8 
  },
  sectionDivider: { 
    height: 1, 
    backgroundColor: '#cbd5e1', 
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  sectionBody: { paddingLeft: 4, marginTop: 10 },
});