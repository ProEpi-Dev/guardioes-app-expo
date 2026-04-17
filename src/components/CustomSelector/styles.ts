import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  defaultOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  defaultCancel: {
    marginTop: 10,
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'center',
  },
});
