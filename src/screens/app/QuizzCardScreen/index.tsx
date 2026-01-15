import React, { useEffect, useState, useCallback } from 'react';
import { Alert, FlatList, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Quizzes, UserQuizzProgress } from '../../../types/quizz';
import QuizzCard from '../../../components/QuizzCard';
import { apiClient } from '../../../utils/api';
import { useParticipation } from '../../../contexts/ParticipationContext';
import { useNavigation } from '@react-navigation/native';

export function Quizz() {
  const { participationId } = useParticipation();
  const [content, setContent] = useState<Quizzes[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchQuizzes = async (): Promise<Quizzes[]> => {
    const response: any = await apiClient(`/v1/forms?active=true&pageSize=50`, { method: 'GET' });
    const forms = response.data || [];
    return forms.filter((f: any) => f.type === 'quiz');
  };

  const fetchResultQuiz = async (): Promise<UserQuizzProgress[]> => {
    const response: any = await apiClient(`/v1/quiz-submissions`, { method: 'GET' });
    const responses = response.data || [];
    return responses.filter((f: any) => f.participationId === participationId);
  };

  const fetchContentQuiz = async (): Promise<any[]> => {
  try {
    const response: any = await apiClient(`/v1/content-quiz?pageSize=100`, { method: 'GET' });
    const data = response.data || response || [];
    return Array.isArray(data) ? data : (data.data || []); 
  } catch (error) {
    console.error("Erro content-quiz", error);
    return []; 
  }
}

const loadData = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);

      const [quizzesData, submissionsData, contentMappingData] = await Promise.all([
        fetchQuizzes(),
        fetchResultQuiz(),
        fetchContentQuiz()
      ]);

      const mergedContent = quizzesData.map((quiz) => {
        const versionId = quiz.latestVersion?.id;

        const passingScore = quiz.latestVersion?.passingScore;
        const maxAttempts = quiz.latestVersion?.maxAttempts;
        const timeLimitMinutes = quiz.latestVersion?.timeLimitMinutes;

        const userResult = submissionsData.find((res) => res.formVersionId === versionId);

        const linkedContentRelation = contentMappingData.find(
            (relation) => String(relation.formId) === String(quiz.id)
        );

        const quizWithContent = {
            ...quiz,
            passingScore: passingScore,
            maxAttempts: maxAttempts,
            timeLimitMinutes: timeLimitMinutes,
            linkedArticle: linkedContentRelation ? linkedContentRelation.content : null
        };

        if (userResult) {
          return { 
            ...quizWithContent, 
            score: userResult.score,
            isPassed: userResult.isPassed,        
            attemptNumber: userResult.attemptNumber,
          };
        }
        
        return quizWithContent;
      });

      setContent(mergedContent);

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os quizzes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing, participationId]);

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhum quiz disponível no momento.</Text>
    </View>
  );

  if (loading && !refreshing && content.length === 0) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

const handleCardPress = (item: Quizzes) => {
  if (item.isPassed) {
    Alert.alert(
      'Parabéns!',
      `Você já foi aprovado neste quiz!\n\nNota: ${item.score}\nTentativas: ${item.attemptNumber}\nSituação: Aprovado`
    );
    return;
  }

  if (item.attemptNumber && item.attemptNumber >= item.maxAttempts!) {
    Alert.alert(
      'Tentativas Esgotadas',
      `Você atingiu o limite de tentativas.\n\nNota: ${item.score}\nSituação: Reprovado\nTentativas: 3/3`
    );
    return;
  }

  navigation.navigate('QuizzInfoScreen', { 
    quizId: item.id,
    title: item.title,
    currentAttempt: (item.attemptNumber || 0) + 1,
    linkedArticle: item.linkedArticle,
    maxAttempts: item.maxAttempts,
    timeLimitMinutes: item.timeLimitMinutes
  });
};

  return (
    <FlatList
      style={styles.list}
      data={content}
      keyExtractor={(item) => String(item.id)}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListEmptyComponent={renderEmptyComponent}
      renderItem={({ item }) => (
        <QuizzCard
          title={item.title}
          active={item.active}
          score={item.score}
          attemptNumber = {item.attemptNumber}
          isPassed = {item.isPassed} 
          passingScore={item.passingScore}    
          maxAttempts={item.maxAttempts}     
          onPress={() => handleCardPress(item)}
        />
      )}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, marginTop: 90, marginBottom: 20 },
  contentContainer: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 90 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' }
});