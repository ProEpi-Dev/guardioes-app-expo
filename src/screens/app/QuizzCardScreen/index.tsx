import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { Quizzes, UserQuizzProgress } from '../../../types/quizz';
import QuizzCard from '../../../components/QuizzCard';

const mockQuizzData: Quizzes[] = [
  { id: 1, active: true, title: 'Quizz 1 - Titulo muito longo para testar os limites do texto dentro do card dos quizzes' },
  { id: 2, active: false, title: 'Quizz 2' },
  { id: 3, active: true, title: 'Quizz 3' },
  { id: 4, active: false, title: 'Quizz 4' },
  { id: 5, active: false, title: 'Quizz 5' },
  { id: 6, active: true, title: 'Quizz 6' },
  { id: 7, active: true, title: 'Quizz 7' },
  { id: 8, active: false, title: 'Quizz 8' },
  { id: 9, active: false, title: 'Quizz 9' },
  { id: 10, active: false, title: 'Quizz 10' },
];

const mockUserProgress: UserQuizzProgress[] = [
    { id: 4, score: 80 },
    { id: 6, score: 100 },
];

export function Quizz() {
  const [content, setContent] = useState<Quizzes[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    const quizzes = mockQuizzData;
    const progress = mockUserProgress;

    const mergedData = quizzes.map((quiz) => {
        const userResult = progress.find((p) => p.id === quiz.id);
        return {
            ...quiz,
            score: userResult ? userResult.score : null 
        };
    });

    setContent(mergedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <FlatList
      style={{ flex: 1, marginTop: 90, marginBottom: 20 }}
      data={content}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <QuizzCard
          title={item.title}
          active={item.active}
          score={item.score}
          onPress={() => {
              if (item.score !== null && item.score !== undefined) {
                  Alert.alert('Resultado', `Você já fez este quiz! Sua nota foi: ${item.score}`);
              } else {
                  Alert.alert('Iniciar', `Abrindo ${item.title}...`);
              }
          }}
        />
      )}
      contentContainerStyle={{ 
        padding: 20,
        paddingBottom: 0,
      }}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
    />
  );
}