import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useQuizInfo } from '../../../hooks/useQuizInfo';

export function QuizInfoScreen() {
  const {
    title,
    currentAttempt,
    maxAttempts,
    timeLimitMinutes,
    linkedArticle,
    loadingContent,
    handleStartQuiz,
    handleGoToContent,
    passingScore
  } = useQuizInfo();

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
          {passingScore !== undefined && passingScore !== null 
            ? `\n- Nota mínima para aprovação: ${passingScore} pontos.` 
            : ''}
          {'\n'}- Ao finalizar, sua nota será calculada automaticamente.
          {timeLimitMinutes ? `\n- Tempo limite: ${timeLimitMinutes} minutos.` : ''}
        </Text>
      </View>

      <View style={styles.attemptContainer}>
        <Feather name="alert-circle" size={40} color="#FFA000" />
        <Text style={styles.attemptLabel}>Você está iniciando a</Text>
        <Text style={styles.attemptNumber}>{currentAttempt}ª Tentativa</Text>
        <Text style={styles.attemptSub}>
          {maxAttempts && maxAttempts > 0 
            ? `de ${maxAttempts} tentativas permitidas` 
            : 'Tentativas ilimitadas'}
        </Text>
      </View>

      <View style={styles.footer}>
        {linkedArticle && (
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleGoToContent}
            disabled={loadingContent}
          >
            {loadingContent ? (
              <ActivityIndicator color="#0000ff" />
            ) : (
              <>
                <Feather name="book-open" size={20} color="#0000ff" />
                <Text style={styles.secondaryButtonText}>
                  Revisar Conteúdo
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={handleStartQuiz}>
          <Text style={styles.primaryButtonText}>Iniciar Quiz</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}