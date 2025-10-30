import { StyleSheet } from 'react-native';
import { scale, percentage } from '../../../utils/scalling'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EBE2',
    padding: 30
  },
  form: {
    width: '100%',
    alignItems: 'center',
    marginBottom: scale(16)
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: scale(14),
    color: '#000',
    textAlign: 'left',
    marginBottom: scale(12)
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    fontSize: scale(14),
    color: '#32323b',
    opacity: 1,
    borderRadius: scale(12),
    paddingVertical: scale(7),
    paddingHorizontal: scale(12)
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#248eac',
    borderRadius: scale(16),
    marginBottom: scale(10),
    paddingVertical: scale(10),
    paddingHorizontal: percentage(12),
    shadowColor: '#248eac',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6
  },
  textButton: {
    fontSize: scale(14),
    textAlign: 'center',
    color: '#fff'
  }
});