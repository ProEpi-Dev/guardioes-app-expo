import { StyleSheet } from "react-native";
import { scale } from "../../utils/scalling";

export const styles = StyleSheet.create({
  banner: { 
    paddingVertical: 16,
    paddingHorizontal: 20, 
    borderRadius: 12, 
    borderWidth: 1.5,
    marginBottom: 20, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { 
    flexDirection: 'column', 
    alignItems: 'center', 
    marginBottom: 4, 
    gap: 8 
  },
  title: { fontWeight: 'bold', fontSize: scale(16), textAlign: 'center' },
  text: { fontSize: scale(14), fontStyle: 'italic', textAlign: 'center', marginBottom: 4 },
  correctText: { fontSize: scale(13), textAlign: 'center', fontWeight: '500' },
});