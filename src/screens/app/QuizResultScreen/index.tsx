import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { scale } from '../../../utils/scalling';
import { FormField } from '../../../types/form';
import { SafeAreaView } from 'react-native-safe-area-context';

// Função auxiliar (a mesma usada na tela de perguntas)
const normalizeAnswer = (val: any): string => {
  if (val === null || val === undefined) return '';
  return String(val).trim().toLowerCase();
};

interface RouteParams {
  resultData: {
    score: number;
    isPassed: boolean;
    totalPoints?: number;
  };
  userAnswers: Record<string, any>;
  questions: FormField[];
  title: string;
}

export function QuizResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { resultData, userAnswers, questions, title } = route.params as RouteParams;

  // Bloqueia o botão voltar do Android para obrigar o uso do botão "Retornar"
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleReturnToHome = () => {
    // popToTop limpa a pilha e volta para a listagem
    navigation.popToTop(); 
  };

  const renderQuestionReview = (question: FormField, index: number) => {
    const userAnswer = userAnswers[question.name];
    const correctAnswer = (question as any).correctAnswer;
    const hasCorrectAnswer = correctAnswer !== undefined && correctAnswer !== null;
    
    // Verifica acerto
    const isCorrect = hasCorrectAnswer 
      ? normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer)
      : true; // Se não tiver gabarito, consideramos neutro/certo visualmente

    // Lógica de Feedback (Mesma prioridade da tela de perguntas)
    const qAny = question as any;
    const selectedOption = qAny.options?.find((opt: any) => 
      normalizeAnswer(opt.value) === normalizeAnswer(userAnswer)
    );

    let feedbackText = selectedOption?.feedback;
    if (!feedbackText && qAny.feedback && qAny.feedback.incorrect) {
        feedbackText = qAny.feedback.incorrect;
    }

    // Encontrar o Label da resposta (para mostrar texto em vez do ID/Value)
    const answerLabel = selectedOption ? selectedOption.label : String(userAnswer || 'Sem resposta');

    return (
      <View key={question.id} style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionIndex}>Questão {index + 1}</Text>
          <Feather 
            name={isCorrect ? "check-circle" : "x-circle"} 
            size={20} 
            color={isCorrect ? "#4CAF50" : "#F44336"} 
          />
        </View>
        
        <Text style={styles.questionTitle}>{question.label}</Text>

        <View style={styles.answerContainer}>
          <Text style={styles.label}>Sua resposta:</Text>
          <Text style={[styles.answerText, { color: isCorrect ? "#4CAF50" : "#F44336" }]}>
            {answerLabel}
          </Text>
        </View>

        {!isCorrect && hasCorrectAnswer && (
           <View style={styles.answerContainer}>
             <Text style={styles.label}>Resposta correta:</Text>
             {/* Tenta achar o label da correta também */}
             <Text style={[styles.answerText, { color: "#4CAF50" }]}>
               {qAny.options?.find((o: any) => normalizeAnswer(o.value) === normalizeAnswer(correctAnswer))?.label || correctAnswer}
             </Text>
           </View>
        )}

        {/* Feedback Personalizado */}
        {feedbackText && (
          <View style={[
            styles.feedbackBox, 
            { backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE' }
          ]}>
            <Text style={[
              styles.feedbackText, 
              { color: isCorrect ? "#2E7D32" : "#C62828" }
            ]}>
              {feedbackText}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabeçalho do Resultado */}
        <View style={styles.headerResult}>
          <Text style={styles.quizTitle}>{title}</Text>
          
          <View style={[
            styles.scoreCircle, 
            { borderColor: resultData.isPassed ? '#4CAF50' : '#F44336' }
          ]}>
            <Text style={[
              styles.scoreValue, 
              { color: resultData.isPassed ? '#4CAF50' : '#F44336' }
            ]}>
              {resultData.score}%
            </Text>
            <Text style={styles.scoreLabel}>Nota Final</Text>
          </View>

          <Text style={[
            styles.statusText, 
            { backgroundColor: resultData.isPassed ? '#4CAF50' : '#F44336' }
          ]}>
            {resultData.isPassed ? "APROVADO" : "REPROVADO"}
          </Text>
        </View>

        <Text style={styles.detailsTitle}>Detalhamento das Questões</Text>
        
        {questions.map((q, i) => renderQuestionReview(q, i))}

      </ScrollView>

      {/* Botão Fixo no Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.returnButton} onPress={handleReturnToHome}>
          <Text style={styles.returnButtonText}>Retornar para os Quizzes</Text>
          <Feather name="list" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  headerResult: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  quizTitle: { fontSize: scale(18), fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreValue: { fontSize: scale(29), fontWeight: 'bold' },
  scoreLabel: { fontSize: scale(12), color: '#666' },
  
  statusText: {
    color: '#FFF',
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: scale(14),
  },

  detailsTitle: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    marginLeft: 4,
  },

  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  questionIndex: { fontSize: scale(12), fontWeight: 'bold', color: '#999' },
  questionTitle: { fontSize: scale(16), color: '#333', marginBottom: 12, fontWeight: '500' },
  
  answerContainer: { flexDirection: 'row', marginBottom: 4, flexWrap: 'wrap' },
  label: { fontWeight: 'bold', color: '#555', marginRight: 6 },
  answerText: { flex: 1 },

  feedbackBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 6,
  },
  feedbackText: { fontSize: scale(14), fontStyle: 'italic' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  returnButton: {
    backgroundColor: '#0000ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  returnButtonText: { color: '#FFF', fontSize: scale(16), fontWeight: 'bold' },
});