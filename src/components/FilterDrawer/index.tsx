import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { ContentType } from '../../types/article';
import { colors } from '../../utils/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  contentTypes: ContentType[];
  selectedFilters: number[];
  onToggleFilter: (id: number) => void;
  onClearFilters: () => void;
}

export function FilterDrawer({
  visible,
  onClose,
  contentTypes,
  selectedFilters,
  onToggleFilter,
  onClearFilters,
}: FilterDrawerProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.drawerContainer}>
          <View style={[styles.drawerHeader, { paddingTop: insets.top }]}>
            <Text style={styles.drawerTitle}>Filtrar Categorias</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            style={styles.list}
            data={contentTypes}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedFilters.includes(item.id);
              return (
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    isSelected && styles.filterOptionSelected,
                  ]}
                  onPress={() => onToggleFilter(item.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && {
                        backgroundColor: colors.azulEscuro,
                        borderColor: colors.azulEscuro,
                      },
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#FFF" />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.filterOptionText,
                      isSelected && styles.filterOptionTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <View style={[styles.drawerFooter, { paddingBottom: insets.bottom }]}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClearFilters}
            >
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButtonContainer}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.azulClaro, colors.azulEscuro]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.applyButtonGradient}
              >
                <Text style={styles.applyButtonText}>Ver Resultados</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}
