import { StyleSheet } from 'react-native';
import { percentage, scale } from '../../utils/scalling';

export const styles = StyleSheet.create({
  drawerItemBlue: {
    backgroundColor: '#348eac',
    marginBottom: 13
  },
  header: {
    marginBottom: 20,
    flexDirection: 'column',
  },
  drawerItemGreen: {
    backgroundColor: '#5DD39E',
    marginBottom: 13,
  },
  drawerLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: -10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: percentage(3),
    marginBottom: percentage(3),
    marginHorizontal: scale(75),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  redeSocial: {
    width: scale(52), 
    height: scale(52),
    borderRadius: scale(26), 
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    backgroundColor: '#348eac',
    shadowColor: '#348eac',
  },
});
