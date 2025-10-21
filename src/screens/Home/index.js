import { StatusBar, Text, ScrollView, View} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { Provider } from 'react-redux'
import { store } from '../../app/store'
import CounterComponent from '../../components/CounterComponent/CounterComponent'
import { styles } from './Styles'

const verde = '#77bfad'
const azul = '#2E97BE'
const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const Home = () => {
    return (
    <View style={styles.container}>
      <StatusBar backgroundColor={azul} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[azul, verde]}
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