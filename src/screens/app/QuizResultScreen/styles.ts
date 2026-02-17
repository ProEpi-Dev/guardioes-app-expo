import { StyleSheet } from "react-native";
import { scale } from "../../../utils/scalling";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  detailsTitle: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    marginLeft: 4,
    textAlign: 'center'
  },

  buttonContainer: {
    marginTop: 24,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  returnButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  returnButton: {
    backgroundColor: '#0000ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  returnButtonText: { color: '#FFF', fontSize: scale(16), fontWeight: 'bold' },
});