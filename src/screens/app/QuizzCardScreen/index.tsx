import React from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import { useParticipation } from '../../../contexts/ParticipationContext';
import QuizCard from '../../../components/QuizCard';
import { styles } from './styles';
import { useQuizList } from '../../../hooks/useQuizList';
import { useQuizNavigation } from '../../../hooks/useQuizNavigation';

export function Quiz() {
  const { participationId } = useParticipation();

  const { content, loading, refreshing, handleRefresh } =
    useQuizList(participationId);
  const { handleCardPress } = useQuizNavigation();

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhum quiz disponível no momento.</Text>
    </View>
  );

  const renderFooter = () => <View style={{ height: 20 }} />;

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
      ListFooterComponent={renderFooter}
      renderItem={({ item }) => (
        <QuizCard
          title={item.title}
          active={item.active}
          score={item.score}
          attemptNumber={item.attemptNumber}
          isPassed={item.isPassed}
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
