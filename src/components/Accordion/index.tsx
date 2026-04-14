import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from 'react-native';

// Habilita LayoutAnimation no Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Definição da interface das Props
interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Valor animado para a rotação (inicia em 0)
  const animationController = useRef(new Animated.Value(0)).current;

  const toggleOpen = () => {
    // 1. Configura a animação de layout (expansão/contração do conteúdo)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // 2. Configura a animação de rotação da seta
    Animated.timing(animationController, {
      toValue: isOpen ? 0 : 1, // Se estava aberto vai p/ 0, se fechado p/ 1
      duration: 300,
      useNativeDriver: true, // Otimização de performance
    }).start();

    // 3. Atualiza o estado
    setIsOpen(!isOpen);
  };

  // Interpolação: Converte 0 -> '0deg' e 1 -> '180deg'
  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleOpen}
        style={styles.header}
        activeOpacity={0.7}
      >
        <Text style={styles.headerText}>{title}</Text>

        {/* View Animada contendo o ícone */}
        <Animated.View style={{ transform: [{ rotate: arrowTransform }] }}>
          {/* Aqui estou usando texto simples 'V', mas você pode usar <Icon name="chevron-down" /> */}
          <Text style={styles.chevron}>▼</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Conteúdo condicional */}
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    // Sombras
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chevron: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});

export default Accordion;
