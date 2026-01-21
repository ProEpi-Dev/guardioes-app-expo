import { StyleSheet } from "react-native";
import { scale } from "../../utils/scalling";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3
  },
  title: {
    fontSize: scale(16),
    fontWeight: 'bold',
    marginLeft: 12,
    marginRight: 12,
    textAlign: 'justify'
  },
  attemptText: {
    fontSize: scale(10),
    color: '#666',
    marginTop: 2
  },
  passingScoreText: {
    fontSize: scale(10),
    color: '#888',
    marginTop: 2,
    fontStyle: 'italic'
  }
});