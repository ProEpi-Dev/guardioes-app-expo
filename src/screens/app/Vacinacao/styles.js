import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scalling'; 

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EBE2',
  },
  title: {
    fontSize: scale(20),
    color: '#348eac',
    fontWeight: 'bold',
    marginVertical: scale(16),
    marginHorizontal: scale(16),
  },
  card: {
    backgroundColor: '#ffffff',
    padding: scale(16),
    marginHorizontal: scale(16),
    marginBottom: scale(10),
    borderRadius: scale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTextName: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#32323B',
  },
  cardTextDate: {
    fontSize: scale(14),
    color: '#666',
    marginTop: scale(4),
  },
  addButton: {
    backgroundColor: '#348eac',
    padding: scale(15),
    margin: scale(16),
    borderRadius: scale(16),
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#348eac',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  modalLabel: {
    fontSize: scale(14),
    color: '#32323B',
    fontWeight: 'bold',
    marginBottom: scale(8),
    marginTop: scale(10),
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: scale(12),
    borderRadius: scale(8),
    fontSize: scale(14),
    marginBottom: scale(16),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: scale(16),
    color: '#333',
    marginLeft: scale(12),
  },
  modalButton: {
    backgroundColor: '#348eac',
    padding: scale(14),
    borderRadius: scale(10),
    alignItems: 'center',
    marginTop: scale(20),
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: scale(15),
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c', // Cor vermelha para deletar
    marginTop: scale(10),
  },


  modalInfoLabel: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#348eac',
    marginTop: scale(10),
  },
  modalInfoText: {
    fontSize: scale(14),
    color: '#32323B',
    marginBottom: scale(12),
  },
});