import React from 'react';
import { View, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../app/counterSlice'; // Importa as actions

const CounterComponent = () => {
  // `useDispatch` é o hook que nos permite "disparar" actions
  const dispatch = useDispatch();
  
  // `useSelector` é o hook para ler um valor do estado da store
  // Acessamos state.counter.value por que em store.js definimos o reducer com a chave 'counter'
  const count = useSelector((state) => state.counter.value);

  const handleIncrement = () => {
    // Dispara a action 'increment'
    dispatch(increment());

    // IMPORTANTE: O estado do Redux não atualiza imediatamente dentro da mesma função.
    // A variável 'count' aqui ainda tem o valor antigo.
    // Para mostrar o novo valor no Alert, somamos +1 ao valor atual.
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

const styles = StyleSheet.create({
  container: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      backgroundColor: '#FFFFFF',
      margin: 7
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  textTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  bemButton: {
    backgroundColor: '#3498db',
    borderBottomLeftRadius: 18,
    borderTopLeftRadius: 18,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 2,
    alignItems: 'center'
  },
  malButton: {
    backgroundColor: '#f39c12',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  }
});

export default CounterComponent;