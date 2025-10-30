import React from 'react';
import { ScrollView, View, Linking, Button, TouchableOpacity, Image, Text } from 'react-native';
import translate from '../../../locales/i18n';

import { TutorialIcon, FAQIcon, TermsIcon, InfoIcon, AccountIcon } from '../../../img/imageConst'

import { styles } from './styles';
import { scale } from '../../../utils/scalling';

export function Ajuda() {
  const user = {is_professional: false}
  return (
    <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>

          {!user.is_professional ? (
            <TouchableOpacity>
              <View style={styles.cardWhite}>
                <View style={styles.avatarWrapper}>
                  <TutorialIcon width={scale(45)} height={scale(45)} />
                </View>

                <View style={styles.infoContainer}>
                  <View style={styles.infoWrapper}>
                    <Text style={styles.cardNameWhite}>
                      {translate('ajuda.tutorialBtn')}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ): null}

          {user.is_professional ? (
            <TouchableOpacity onPress={() => Linking.openURL('https://ajuda.gds.sds.unb.br')}>
              <View style={styles.cardWhite}>
                <View style={styles.avatarWrapper}>
                  <TutorialIcon width={scale(45)} height={scale(45)} />
                </View>

                <View style={styles.infoContainer}>
                  <View style={styles.infoWrapper}>
                    <Text style={styles.cardNameWhite}>
                      Tutorial para Líderes Comunitários
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ): null}

          
          <TouchableOpacity onPress={() => Linking.openURL('https://tinyurl.com/gds-faq-unb')}>
            <View style={styles.cardWhite}>
              <View style={styles.avatarWrapper}>
                <FAQIcon width={scale(45)} height={scale(45)} />
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoWrapper}>
                  <Text style={styles.cardNameWhite}>
                    {translate('ajuda.faqBtn')}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.cardWhite}>
              <View style={styles.avatarWrapper}>
                <TermsIcon width={scale(45)} height={scale(45)} />
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoWrapper}>
                  <Text style={styles.cardNameWhite}>
                    {translate('ajuda.useTermsBtn')}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.cardWhite}>
              <View style={styles.avatarWrapper}>
                <InfoIcon width={scale(45)} height={scale(45)} />
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoWrapper}>
                  <Text style={styles.cardNameWhite}>
                    {translate('ajuda.aboutBtn')}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.cardWhite}>
              <View style={styles.avatarWrapper}>
                <AccountIcon width={scale(45)} height={scale(45)} />
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoWrapper}>
                  <Text style={styles.cardNameWhite}>
                    {translate('deleteAccount.title')}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

        </ScrollView>
    </View>
  );
}