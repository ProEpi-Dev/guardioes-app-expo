import { View, Alert, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../../app/counterSlice';
import { styles } from './Styles'
import translate from '../../locales/i18n'

const CounterComponent = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);

  const handleIncrement = () => {
    dispatch(increment());
    Alert.alert('Valor Atualizado!', `O novo valor é: ${count + 1}`);
  };

  const handleDecrement = () => {
    dispatch(decrement());
    Alert.alert('Valor Atualizado!', `O novo valor é: ${count - 1}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>{translate('home.userHowYouFelling')}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.bemButton]} onPress={handleIncrement} >
            <Text style={styles.text}>{translate('report.goodChoice')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.malButton]} onPress={handleDecrement} >
            <Text style={styles.text}>{translate('report.badChoice')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CounterComponent;