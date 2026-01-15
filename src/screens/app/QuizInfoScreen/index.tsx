import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale } from '../../../utils/scalling'; 
import { apiClient } from '../../../utils/api';
import { LinkedArticle } from '../../../types/quizz';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RouteParams {
  quizId: number;
  title: string;
  currentAttempt: number;
  linkedArticle?: LinkedArticle | null;
}

export function QuizzInfoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { quizId, title, currentAttempt, linkedArticle } = route.params as RouteParams;

  const [loadingContent, setLoadingContent] = useState(false);

  const handleStartQuiz = () => {
    Alert.alert("Iniciar", "Navegando para as perguntas...");
  };

  const handleGoToContent = async () => {
    if (!linkedArticle || !linkedArticle.id) {
      Alert.alert("Indisponível", "Não há material de leitura vinculado a este quiz.");
      return;
    }

    try {
      setLoadingContent(true);
      const response: any = await apiClient(`/v1/contents/${linkedArticle.id}`, { method: 'GET' });
      const fullArticle = response.data || response;

      if (!fullArticle || !fullArticle.content) {
         throw new Error("O conteúdo do artigo está vazio.");
      }

      navigation.navigate('Article', { article: fullArticle });

    } catch (error) {
      console.error("Erro ao buscar artigo:", error);
      Alert.alert("Erro", "Não foi possível carregar o conteúdo completo. Verifique sua conexão.");
    } finally {
      setLoadingContent(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.instructionsContainer}>
        <View style={styles.iconHeader}>
           <Feather name="info" size={24} color="#0000ff" />
           <Text style={styles.sectionTitle}>Instruções</Text>
        </View>
        <Text style={styles.instructionText}>
          - Este quiz contém perguntas de múltipla escolha.
          {'\n'}- O objetivo é testar seus conhecimentos sobre "{title}".
          {'\n'}- Leia atentamente cada questão antes de responder.
          {'\n'}- Ao finalizar, sua nota será calculada automaticamente.
        </Text>
      </View>

      <View style={styles.attemptContainer}>
        <Feather name="alert-circle" size={40} color="#FFA000" />
        <Text style={styles.attemptLabel}>Você está iniciando a</Text>
        <Text style={styles.attemptNumber}>{currentAttempt}ª Tentativa</Text>
        <Text style={styles.attemptSub}>de 3 tentativas permitidas</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.secondaryButton, !linkedArticle && styles.disabledButton]} 
          onPress={handleGoToContent}
          disabled={loadingContent || !linkedArticle}
        >
          {loadingContent ? (
             <ActivityIndicator color="#0000ff" />
          ) : (
             <>
               <Feather name="book-open" size={20} color={linkedArticle ? "#0000ff" : "#999"} />
               <Text style={[styles.secondaryButtonText, !linkedArticle && { color: '#999' }]}>
                 {linkedArticle ? 'Revisar Conteúdo' : 'Sem Conteúdo'}
               </Text>
             </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleStartQuiz}>
          <Text style={styles.primaryButtonText}>Iniciar Quiz</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'space-between'
  },
  instructionsContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  instructionText: {
    fontSize: scale(14),
    color: '#555',
    lineHeight: 24,
  },
  attemptContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop:5
  },
  attemptLabel: {
    fontSize: scale(16),
    color: '#666',
    marginTop: 10,
  },
  attemptNumber: {
    fontSize: scale(32),
    fontWeight: 'bold',
    color: '#FFA000', 
    marginVertical: 5,
  },
  attemptSub: {
    fontSize: scale(12),
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0000ff',
    elevation: 2,
  },
  disabledButton: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
    elevation: 0
  },
  secondaryButtonText: {
    color: '#0000ff',
    fontWeight: 'bold',
    fontSize: scale(14),
    marginLeft: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000ff',
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scale(14),
    marginRight: 8,
  },
});