import { StyleSheet } from 'react-native';
import { scale, percentage } from '../../../utils/scalling'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EBE2'
  },
  box: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: scale(18),
    backgroundColor: '#ffffff',
    padding: scale(15),
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignItems: 'center'
  },
  button: {
    marginBottom: percentage(5), 
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F3EBE2',
    paddingTop: 30,
    paddingHorizontal: 20
  },
  title: {
    fontSize: scale(16),
    color: '#348eac'
  },
  infoWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  iconWrapper: {
    marginRight: percentage(4)
  },
});
