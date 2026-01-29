import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Item da Timeline
  itemContainer: { flexDirection: 'row', minHeight: 70 },
  timelineContainer: { width: 30, alignItems: 'center' },
  verticalLine: {
    position: 'absolute',
    top: 24,
    bottom: -24,
    width: 2,
    backgroundColor: '#e5e7eb',
    zIndex: -1,
  },
  nodeCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginTop: 2,
    borderWidth: 1,
  },
  
  // Conteúdo e Metadados
  contentContainer: { flex: 1, paddingLeft: 14, paddingBottom: 24 },
  itemTitle: { fontSize: 16, color: '#374151', fontWeight: '600', lineHeight: 22, marginBottom: 4 },
  lockedText: { color: '#9ca3af' },

  metaContainer: { marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  metaTextBold: { fontWeight: 'bold', fontSize: 13, marginRight: 6 },
  metaTextSmall: { fontSize: 12, color: '#6b7280' },
});