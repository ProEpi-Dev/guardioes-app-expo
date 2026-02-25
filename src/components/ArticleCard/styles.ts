import { StyleSheet } from "react-native";

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
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  summary: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'justify'
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
});