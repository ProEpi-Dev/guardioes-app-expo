import { StyleSheet } from 'react-native';
import { colors } from '../../../utils/colors';
import { scale } from '../../../utils/scalling';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 20 },

  headerProfile: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#348eac',
  },
  headerName: { fontSize: 22, fontWeight: 'bold', color: colors.principal },
  headerEmail: { fontSize: 16, color: '#666' },

  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.principal },
  sectionDescription: { fontSize: 14, color: '#666', marginBottom: 16 },
  editLink: { color: colors.principal, fontWeight: 'bold' },

  formGroup: { marginBottom: 12 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  disabledInput: { backgroundColor: '#f9f9f9', color: '#888' },

  passwordContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  togglePasswordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  togglePasswordText: { marginLeft: 8, color: '#348eac', fontWeight: '500' },

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  cancelButton: { padding: 10 },
  cancelText: { color: '#666' },
  saveButton: {
    backgroundColor: '#348eac',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: { color: '#fff', fontWeight: 'bold' },

  buttonContainer: {
    marginTop: 5,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  buttonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 8,
  },
  returnButtonText: { color: '#FFF', fontSize: scale(16), fontWeight: 'bold' },
});
