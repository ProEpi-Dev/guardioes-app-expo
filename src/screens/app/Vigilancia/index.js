import React from 'react';
import { Text, View, ScrollView, TextInput } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { styles } from './styles';

export function Vigilancia() {
  const [number, onChangeNumber] = React.useState('');

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <View style={styles.info}>
          <Text style={styles.title}>O que é?</Text>
          <Text style={styles.texto}>A Vigilância Ativa Intitucional tem o intuito de conhecer, monitorar e identificar a situação de daúde dos usuários do aplicativo, que pertencem a alguma instituição, com enfoque nos sintomas relatados da COVID-19. Assim, ao apresentar os sintomas, o mesmo receberá auxílio de especialistas da área de saúde via telefone.</Text>
          <Text style={styles.title}>Você já está participando!</Text>
        </View>

        <View style={styles.infoNumber}>
          <Text style={styles.titleNumero}>Informe seu telefone:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNumber}
            value={number}
            placeholder="(61) 98888-8888"
            keyboardType='numeric'
          />
        </View>

        <View style={styles.confirmacao}>
          <View style={styles.box}>
            <Feather name="check-circle" size={24} color="black" />
            <Text style={styles.verificacao}>Confirmo que li as informações e estou ciente das alterações que serão realizadas após a confirmação</Text>
          </View>
          <Feather name="help-circle" size={24} color="black" />
        </View>
      </ScrollView>
    </View>
  );
}