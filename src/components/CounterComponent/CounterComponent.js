import { View, Alert, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../../app/counterSlice';
import { styles } from './Styles'

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
      <Text style={styles.textTitle}>Como está se sentindo hoje?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.bemButton]} onPress={handleIncrement} >
            <Text style={styles.text}>BEM</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.malButton]} onPress={handleDecrement} >
            <Text style={styles.text}>MAL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CounterComponent;