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
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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