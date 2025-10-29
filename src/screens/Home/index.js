import { StatusBar, Text, ScrollView, View} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { Provider } from 'react-redux'
import { store } from '../../app/store'
import CounterComponent from '../../components/CounterComponent/CounterComponent'
import { styles } from './Styles'
import translate from '../../locales/i18n'

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
                    <Text style={styles.headerTitle}>
                      {translate('home.hello') + 'Vinícius'}
                    </Text>
                    <Text style={styles.headerSubtitle}>{translate('home.nowAGuardian')}</Text>
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

          <Text style={styles.alertsTitle}>{translate('home.alerts')}</Text>

          <Card style={styles.alertCard}>
            <Text style={styles.alertText}>
              {translate('home.vaccination')} {'\n'}
              <Text style={styles.alertSubtext}>{translate('home.vaccinationData')}</Text>
            </Text>
          </Card>

          <Card style={styles.statusCard}>
            <Text style={styles.statusText}>
              {translate('home.statusLast7Days')} {'\n'}
              <Text style={styles.statusSubtext}>{translate('home.statusLast7DaysGood')}</Text>
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