import React from 'react'
import { StatusBar, Text, ScrollView, View, StyleSheet} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { Provider } from 'react-redux'
import { store } from '../../app/store'
import CounterComponent from '../../components/CounterComponent'

const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const Home = () => {
    return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#348EAC' barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#348EAC', '#5DD39E']}
          style={styles.header}
        >

            <View style={styles.inLine}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Olá, Vinícius</Text>
                    <Text style={styles.headerSubtitle}>Guardião da Saúde</Text>
                </View>

                <View style={styles.circle}/>
            </View>
        </LinearGradient>

        <View style={styles.cardsContainer}>
          <Card>
            <Provider store={store}>
                <View>
                    <CounterComponent />
                </View>
            </Provider>
          </Card>

          <Text style={styles.alertsTitle}>Alertas</Text>

          <Card style={styles.alertCard}>
            <Text style={styles.alertText}>
              Vacinação: {'\n'}
              <Text style={styles.alertSubtext}>Atualize seus dados de vacinação</Text>
            </Text>
          </Card>

          <Card style={styles.statusCard}>
            <Text style={styles.statusText}>
              Status nos últimos 7 dias: {'\n'}
              <Text style={styles.statusSubtext}>Você tem se sentido bem.</Text>
            </Text>
          </Card>

          {/* Cards extras para testar o scroll */}
          <Card><Text>Item extra 1</Text></Card>
          <Card><Text>Item extra 2</Text></Card>
          <Card><Text>Item extra 3</Text></Card>
          <Card><Text>Item extra 4</Text></Card>
          <Card><Text>Item extra 5</Text></Card>            
        </View>
      </ScrollView>
    </View>
  );
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2EBF91',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 80,
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
  cardQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonBlue: {
    backgroundColor: '#3498db',
  },
  buttonOrange: {
    backgroundColor: '#f39c12',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
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