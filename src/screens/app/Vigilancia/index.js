import React, { useState } from 'react';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { styles } from './styles';
import { PrivacyModal } from '../../../components/Modal';
import translate from '../../../locales/i18n'

export function Vigilancia() {
  const [number, onChangeNumber] = React.useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const modalRawText = translate('vigilanceTerms.text');
  const textBlocks = modalRawText.split('\n\n');

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.info}>
          <Text style={styles.title}>{translate('surveillance.whatIs')}</Text>
          <Text style={styles.texto}>{translate('surveillance.textAbout')}</Text>
          <Text style={styles.title}>{translate('surveillance.participateSuccess')}</Text>
        </View>

        <View style={styles.infoNumber}>
          <Text style={styles.titleNumero}>{translate('surveillance.phone')}</Text>
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
            <Feather name="check-circle" size={25} color="#348eac" />
            <Text style={styles.verificacao}>{translate('surveillance.confirmRead')}</Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Feather name="help-circle" size={25} color="#348eac" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.textoButton}>
            {translate('surveillance.cancelParticipation')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <PrivacyModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)}
        title={translate('vigilanceTerms.title')}
      >
        {textBlocks.map((block, index) => {
          const isSubtitle = /^[0-9]+\./.test(block.trim());

          return (
            <Text 
              key={index} 
              style={isSubtitle ? styles.modalSubtitle : styles.modalText}
            >
              {block}
            </Text>
          );
        })}
      </PrivacyModal>
    </View>
  );
}