import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2EBF91',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F3EBE2',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerContent: {
    paddingHorizontal: 10,
    paddingBottom: 65,
    paddingTop: 55
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    marginTop: -60,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    paddingBottom: 27,
    paddingTop: 27
  },
  alertsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  alertCard: {
    backgroundColor: '#2ECC71',
  },
  alertText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  alertSubtext: {
    fontWeight: 'normal',
    fontSize: 16,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#2ECC71',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusSubtext: {
    fontWeight: 'normal',
    fontSize: 16,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'black',
    top: '55',
    right: '-90'
    
  },
  inLine: {
    flexDirection: 'row',
  }
});