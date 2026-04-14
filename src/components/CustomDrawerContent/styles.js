import { StyleSheet } from 'react-native';
import { percentage, scale } from '../../utils/scalling';

export const styles = StyleSheet.create({
  drawerItemBlue: {
    backgroundColor: '#348eac',
    marginBottom: 13,
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
    marginTop: 'auto',
    marginBottom: percentage(3),
    marginHorizontal: scale(75),
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
    shadowColor: '#00A89F',
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  closeContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#348eac',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 15,
    marginBottom: 20,
  },

  botao: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  actionButtonContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
    paddingLeft: 50,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: scale(15),
    fontWeight: 'bold',
  },
});
