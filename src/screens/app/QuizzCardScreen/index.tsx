import React, { useEffect, useState, useCallback } from 'react';
import { Alert, FlatList, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Quizzes, UserQuizzProgress } from '../../../types/quizz';
import QuizzCard from '../../../components/QuizzCard';
import { apiClient } from '../../../utils/api';
import { useParticipation } from '../../../contexts/ParticipationContext';

export function Quizz() {
  const { participationId } = useParticipation();
  const [content, setContent] = useState<Quizzes[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const loadData = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);

      const [quizzesData, submissionsData] = await Promise.all([
        fetchQuizzes(),
        fetchResultQuiz()
      ]);

      const mergedContent = quizzesData.map((quiz) => {
        const versionId = quiz.latestVersion?.id;
        const userResult = submissionsData.find(
          (res) => res.formVersionId === versionId
        );

        if (userResult) {
          return { 
            ...quiz, 
            score: userResult.score,
            isPassed: userResult.isPassed,        
            attemptNumber: userResult.attemptNumber,
          };
        }
        
        return quiz;
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
          onPress={() => {
            if (item.score !== null && item.score !== undefined) {
              const status = item.isPassed ? "Aprovado" : "Reprovado";
              const tentativas = item.attemptNumber ? `(Tentativa ${item.attemptNumber})` : "";
              
              Alert.alert(
                'Resultado', 
                `Nota: ${item.score}\nStatus: ${status}\n${tentativas}`
              );
            } else {
              Alert.alert('Iniciar', `Abrindo ${item.title}...`);
            }
          }}
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