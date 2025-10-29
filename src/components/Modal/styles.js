import { StyleSheet } from 'react-native';
import { scale } from '../../utils/scalling'; 

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: scale(20),
    padding: scale(20),
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCloseButton: {
    position: 'absolute',
    top: -15,
    right: -10,
    backgroundColor: '#348eac',
    borderRadius: 50,
    padding: scale(5),
    elevation: 6,
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#348eac',
    textAlign: 'center',
    marginBottom: scale(15),
  },
  modalScrollView: {
    maxHeight: '80%',
  },
});