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
import { CustomHeader } from '../../../../components/CustomHeader'; // ADICIONADO
import { useAuth } from '../../../../contexts/AuthContext'; // ADICIONADO

type Props = NativeStackScreenProps<RootTrailParamList, 'Accordion'>;

export default function TrailContent({ route }: Props) {
  const { user } = useAuth();
  const { participationId } = useParticipation();
  const { cycleId, title, isCycleExpired } = route.params || {};
  const { trailData, enrichedSections, loading, trackProgressId } = useTrailContent(cycleId, participationId);
  const { handleQuizPress, handleArticlePress, loading: navLoading } = useTrailNavigation();

  // ... (mantenha as checagens de loading/empty originais)
  if (loading || navLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  const sectionsToRender = enrichedSections.length > 0 ? enrichedSections : (trailData?.section || []);

  return (
    <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
      {/* Cabeçalho igual ao da imagem */}
      <CustomHeader userName={user?.name} showBackButton={true}/>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Título da Trilha centralizado */}
        <View style={styles.trailHeader}>
           <Text style={styles.trailTitleText}>Trilha: {title}</Text>
        </View>

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
                  onPressQuiz={() => handleQuizPress(seq, trackProgressId, isCycleExpired)}
                  onPressArticle={() => handleArticlePress(seq.content, trackProgressId, seq.id, isCycleExpired)}
                />
              ))}
            </View>

          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}