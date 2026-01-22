import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Accordion from '../../../../components/Accordion';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ArticleCard from '../../../../components/ArticleCard';
import { RootTrailParamList } from '../../../../types/trail';

type Props = NativeStackScreenProps<RootTrailParamList, 'Accordion'>;

export default function TrailContent ({ route, navigation }: Props) {
  const rawTrail = route.params?.trail;
  const trailData = Array.isArray(rawTrail) ? rawTrail[0] : rawTrail;

  if (!trailData) return <View style={styles.center}><Text>Trilha não encontrada</Text></View>;

  const renderTrailSections = () => {
    const sectionsList = trailData.section || [];

    if (sectionsList.length === 0) {
      return <Text style={{padding: 20}}>Nenhuma seção encontrada.</Text>;
    }

    return sectionsList.map((sectionItem: any) => (
      <Accordion key={sectionItem.id} title={sectionItem.name}>
        {(sectionItem.sequence || []).map((seq: any) => 
          seq.content ? (
            <ArticleCard
              key={seq.id}
              title={seq.content.title}
              summary={seq.content.summary}
              onPress={() => navigation.navigate('Article', { 
                  article: seq.content
              })}
            />
          ) : null
        )}
      </Accordion>
    ));
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>        
        {renderTrailSections()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F2' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingVertical: 10 }
});