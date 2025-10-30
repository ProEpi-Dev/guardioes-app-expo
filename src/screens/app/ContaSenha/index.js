import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native'

import { styles } from './styles';

export function ContaSenha() {
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Senha Atual</Text>
        <TextInput
            style={styles.input}
            onChangeText={setOldPassword}
            value={oldPassword}
            keyboardType='password'
          />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nova Senha</Text>
        <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            keyboardType='password'
          />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Confirmar Nova Senha</Text>
        <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            keyboardType='password'
          />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.textButton}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}