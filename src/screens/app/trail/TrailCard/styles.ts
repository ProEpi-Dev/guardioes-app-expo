import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: { 
    padding: 20,
    paddingBottom: 20
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  }
});