import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import translate from '../../locales/i18n';
import { colors } from '../../utils/colors';

interface FeelingCardProps {
  onFeelingSelected: (feeling: 'good' | 'bad') => void;
  isCompliant?: boolean;
  padBottom?: number;
  bottomOffset?: number;
  goodButtonText?: string;
  badButtonText?: string;
  title?: string;
}

export const FeelingCard: React.FC<FeelingCardProps> = ({
  onFeelingSelected,
  isCompliant = false,
  padBottom = 16,
  bottomOffset = 0,
  goodButtonText = translate('report.goodChoice') || 'BEM',
  badButtonText = translate('report.badChoice') || 'MAL',
  title = translate('home.userHowYouFelling') || 'Como você se sente hoje?',
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.cardContainer,
        { paddingBottom: Math.max(insets.bottom, padBottom) + bottomOffset },
      ]}
    >
      <View style={[styles.card, !isCompliant && { opacity: 0.5 }]}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.goodButton]}
            onPress={() => onFeelingSelected('good')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{goodButtonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.badButton]}
            onPress={() => onFeelingSelected('bad')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{badButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#32323b',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginHorizontal: 4,
  },
  goodButton: {
    backgroundColor: colors.botãoBem,
  },
  badButton: {
    backgroundColor: colors.botãoMal,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
