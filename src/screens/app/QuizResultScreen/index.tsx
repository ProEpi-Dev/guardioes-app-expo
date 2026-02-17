import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResultNavigation } from '../../../hooks/useResultNavigation';
import { ScoreHeader } from '../../../components/ScoreHeader';
import { QuestionReviewCard } from '../../../components/QuestionReviewCard';
import { styles } from './styles';
import { CustomHeader } from '../../../components/CustomHeader';
import { useAuth } from '../../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../utils/colors';


export function QuizResultScreen() {
  const { user } = useAuth();
  const { params, handleReturnToHome } = useResultNavigation();
  const { resultData, userAnswers, questions, title } = params;
  const insets = useSafeAreaInsets();

  const bottomBarHeight = 60 + insets.bottom;

  return (
    <View style={styles.container}>
      <CustomHeader userName={user?.name} showButton={false}/>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomBarHeight + 20 }]}>
        
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

      <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={handleReturnToHome}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.azulClaro, colors.azulEscuro]}
            start={{ x: 0, y: 0 }} // Começa na esquerda
            end={{ x: 1, y: 0 }}   // Termina na direita
            style={styles.returnButtonGradient}
          >
            <Text style={styles.returnButtonText}>Retornar para os quizzes</Text>
          </LinearGradient>
        </TouchableOpacity>
        
      </ScrollView>

    </View>
  );
}