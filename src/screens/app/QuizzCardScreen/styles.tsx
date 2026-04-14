import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  list: { flex: 1, marginTop: 90, marginBottom: 20 },
  contentContainer: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
});
