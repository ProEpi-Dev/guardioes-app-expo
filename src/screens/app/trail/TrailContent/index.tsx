import React from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Accordion from '../../../../components/Accordion';
import ArticleCard from '../../../../components/ArticleCard';
import QuizCard from '../../../../components/QuizCard';
import { RootTrailParamList } from '../../../../types/trail';
import { useParticipation } from '../../../../contexts/ParticipationContext';
import { styles } from './styles';
import { useTrailContent } from '../../../../hooks/useTrailContent';
import { useTrailNavigation } from '../../../../hooks/useTrailNavigation';

type Props = NativeStackScreenProps<RootTrailParamList, 'Accordion'>;

export default function TrailContent({ route }: Props) {
  const { participationId } = useParticipation();
  const { trailData, enrichedSections, loading } = useTrailContent(route.params?.trail, participationId);
  const { handleQuizPress, handleArticlePress } = useTrailNavigation();

  if (!trailData) {
    return <View style={styles.center}><Text>Trilha não encontrada</Text></View>;
  }

  if (loading && enrichedSections.length === 0) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  const sectionsToRender = enrichedSections.length > 0 ? enrichedSections : (trailData.section || []);

  if (sectionsToRender.length === 0) {
    return <Text style={styles.emptyText}>Nenhuma seção encontrada nesta trilha.</Text>;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {sectionsToRender.map((sectionItem: any) => (
          <Accordion key={sectionItem.id} title={sectionItem.name}>
            {(sectionItem.sequence || []).map((seq: any) => {
              
              // Render Article
              if (seq.content) {
                return (
                  <ArticleCard
                    key={seq.id}
                    title={seq.content.title}
                    summary={seq.content.summary}
                    onPress={() => handleArticlePress(seq.content)}
                  />
                );
              }

              // Render Quiz
              if (seq.form) {
                return (
                  <QuizCard
                    key={seq.id}
                    title={seq.form.title}
                    active={seq.active}
                    score={seq.score}
                    attemptNumber={seq.attemptNumber}
                    isPassed={seq.isPassed}
                    passingScore={seq.passingScore}
                    maxAttempts={seq.maxAttempts}
                    onPress={() => handleQuizPress(seq)}
                  />
                );
              }

              return null;
            })}
          </Accordion>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}