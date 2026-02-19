import { StyleSheet } from "react-native";
import { scale } from "../../utils/scalling";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    width: '75%',
    backgroundColor: '#FFF',
    height: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  backdrop: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  drawerTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    flex: 1,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  filterOptionSelected: {
    backgroundColor: '#F0F8FF',
  },
  filterOptionText: {
    flex: 1,
    fontSize: scale(15),
    color: '#555',
  },
  filterOptionTextSelected: {
    fontWeight: 'bold',
    color: '#111',
  },
  drawerFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  clearButtonText: {
    fontSize: scale(14),
    color: '#666',
    fontWeight: 'bold',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  applyButtonContainer: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  applyButtonText: {
    fontSize: scale(14),
    color: '#FFF',
    fontWeight: 'bold',
  },
});