import { StyleSheet } from 'react-native';
import { percentage, scale } from '../../../utils/scalling';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EBE2'
  },
  scrollContainer: {
    paddingHorizontal: scale(20),
    paddingTop: scale(15)
  },
  cardWhite: {
    flexDirection: 'row',
    borderRadius: scale(18),
    marginBottom: scale(12),
    padding: scale(15),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      height: 0,
      width: 4
    },
    backgroundColor: '#fff',
    elevation: 5
  },
  avatarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: percentage(4)
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  cardNameWhite: {
    fontSize: scale(16),
    includeFontPadding: false,
    color: '#348eac'
  }
});