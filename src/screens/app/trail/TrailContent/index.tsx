import React from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootTrailParamList } from '../../../../types/trail';
import { useParticipation } from '../../../../contexts/ParticipationContext';
import { useTrailContent } from '../../../../hooks/useTrailContent';
import { useTrailNavigation } from '../../../../hooks/useTrailNavigation';
import { styles } from './styles';
import { TimelineItem } from '../../../../components/TimelineItem';

type Props = NativeStackScreenProps<RootTrailParamList, 'Accordion'>;

export default function TrailContent({ route }: Props) {
  const { participationId } = useParticipation();
  const { trailData, enrichedSections, loading, trackProgressId  } = useTrailContent(route.params?.cycleId, participationId);
  const { handleQuizPress, handleArticlePress, loading: navLoading } = useTrailNavigation();
  
  if (loading || navLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }
  
  if (!trailData) {
    return <View style={styles.center}><Text>Trilha não encontrada</Text></View>;
  }

  if (loading && enrichedSections.length === 0) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  const sectionsToRender = enrichedSections.length > 0 ? enrichedSections : (trailData.section || []);

  if (sectionsToRender.length === 0) {
    return <Text style={styles.emptyText}>Nenhuma seção encontrada.</Text>;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sectionsToRender.map((sectionItem: any) => (
          <View key={sectionItem.id} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sectionItem.name}</Text>
              <View style={styles.sectionDivider} />
            </View>
            
            <View style={styles.sectionBody}>
              {(sectionItem.sequence || []).map((seq: any, index: number) => (
                <TimelineItem 
                  key={seq.id}
                  seq={seq}
                  isLastItem={index === (sectionItem.sequence || []).length - 1}
                  onPressQuiz={() => handleQuizPress(seq, trackProgressId)}
                  onPressArticle={() => handleArticlePress(seq.content, trackProgressId, seq.id)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}