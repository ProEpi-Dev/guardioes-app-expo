import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResultNavigation } from '../../../hooks/useResultNavigation';
import { ScoreHeader } from '../../../components/ScoreHeader';
import { QuestionReviewCard } from '../../../components/QuestionReviewCard';
import { styles } from './styles';


export function QuizResultScreen() {
  const { params, handleReturnToHome } = useResultNavigation();
  const { resultData, userAnswers, questions, title } = params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <ScoreHeader 
          title={title} 
          score={resultData.score} 
          isPassed={resultData.isPassed} 
        />

        <Text style={styles.detailsTitle}>Detalhamento das Questões</Text>
        
        {questions.map((question, index) => (
          <QuestionReviewCard 
            key={question.id}
            question={question}
            index={index}
            userAnswer={userAnswers[question.name]}
          />
        ))}

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.returnButton} onPress={handleReturnToHome}>
          <Text style={styles.returnButtonText}>Retornar para os Quizzes</Text>
          <Feather name="list" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}