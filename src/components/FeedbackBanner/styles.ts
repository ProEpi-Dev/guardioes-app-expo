import { StyleSheet } from "react-native";
import { scale } from "../../utils/scalling";

export const styles = StyleSheet.create({
  banner: { padding: 16, borderRadius: 8, marginBottom: 16, marginTop: 5 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  title: { fontWeight: 'bold', fontSize: scale(16), flex: 1 },
  text: { fontSize: scale(14), color: '#333', fontStyle: 'italic', marginLeft: 34 },
  correctText: { fontSize: scale(12), color: '#666', marginTop: 4, marginLeft: 34, fontWeight: '600' },
});