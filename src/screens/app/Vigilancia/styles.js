import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scalling'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EBE2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    alignSelf: "flex-start",
    fontSize: scale(20),
    textAlign: 'left',
    color: '#348eac',
    includeFontPadding: false,
    marginBottom: scale(20),
    padding: 0
  },
  texto: {
    fontSize: scale(14),
    textAlign: 'justify',
    color: '#2b3d51',
    marginBottom: scale(30)
  },
  info: {
    maxHeight: '90%',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: scale(16),
  },
  infoNumber: {
    maxHeight: '90%',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingHorizontal: scale(16),
  },
  titleNumero: {
    alignSelf: 'flex-start',
    fontSize: scale(14),
    color: '#32323B',
    textAlign: 'left',
    marginBottom: scale(12)
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    fontSize: scale(14),
    color: '#3232B',
    opacity: 0.5,
    borderRadius: scale(12),
    paddingVertical: 0,
    paddingHorizontal: scale(12)
  },
  confirmacao: {
    maxHeight: '90%',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  box: {
    maxHeight: '90%',
    width: '65%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: scale(10),
    overflow: 'hidden',
    alignItems: 'center',
    columnGap: 10
  },
  verificacao: {
    flexWrap: 'wrap',
    textAlign: 'justify'
  }
});