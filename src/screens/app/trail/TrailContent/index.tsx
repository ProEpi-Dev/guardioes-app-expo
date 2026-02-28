import React, { useCallback } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity, BackHandler, DeviceEventEmitter } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootTrailParamList } from '../../../../types/trail';
import { useParticipation } from '../../../../contexts/ParticipationContext';
import { useTrailContent } from '../../../../hooks/useTrailContent';
import { useTrailNavigation } from '../../../../hooks/useTrailNavigation';
import { styles } from './styles';
import { TimelineItem } from '../../../../components/TimelineItem';
import { CustomHeader } from '../../../../components/CustomHeader'; // ADICIONADO
import { useAuth } from '../../../../contexts/AuthContext'; // ADICIONADO
import { getItemStatus } from '../../../../utils/trailContentStatus';
import { colors } from '../../../../utils/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useSentimentLogic } from '../../../../hooks/useSentimentLogic';
import { CommonActions, StackActions, useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootTrailParamList, 'Accordion'>;

export default function TrailContent({ route, navigation }: Props) {
  const { user } = useAuth();
  const { participationId } = useParticipation();
  const { cycleId, title, isCycleExpired } = route.params || {};
  const { trailData, enrichedSections, loading, trackProgressId } = useTrailContent(cycleId, participationId);
  const { handleQuizPress, handleArticlePress, loading: navLoading } = useTrailNavigation();
  const { isCompliant } = useSentimentLogic();
  const insets = useSafeAreaInsets();
  const bottomPadding = 60 + insets.bottom + 40;

  const handleBackBehavior = useCallback(() => {
    if (!isCompliant) {
      // 1. Navega para a aba Inicial (Mapa)
      (navigation as any).navigate('Inicio', { screen: 'Home' });
      
      // 2. Reseta silenciosamente a pilha atual para a listagem (sem animações conflitantes)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }], // "Home" aqui é o TrailCard definido no seu TrailStack
        })
      );
      
      return true; 
    }
    // Se está tudo certo, permite voltar pra listagem de trilhas normalmente
    navigation.goBack();
    return true;
  }, [isCompliant, navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackBehavior);
      return () => subscription.remove();
    }, [handleBackBehavior])
  );

  // ... (mantenha as checagens de loading/empty originais)
  if (loading || navLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  const sectionsToRender = enrichedSections.length > 0 ? enrichedSections : (trailData?.section || []);

  const isTrailCompleted = sectionsToRender.length > 0 && sectionsToRender.every((sectionItem: any) => 
    (sectionItem.sequence || []).every((seq: any) => getItemStatus(seq) === 'completed')
  );

  return (
    <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
      {/* Cabeçalho igual ao da imagem */}
      <CustomHeader userName={user?.name} showBackButton={true} onBackPress={handleBackBehavior}/>
      
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}>
        
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

        {isTrailCompleted && (
          <TouchableOpacity 
            style={styles.buttonContainer} 
            onPress={() => {
              // 1. Avisa o BottomNavigator para mostrar a barra na mesma hora!
              DeviceEventEmitter.emit('force_compliance_update', true);
              // 3. Substitui silenciosamente o histórico da aba atual para a listagem (TrailCard)
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                })
              );

              // 2. Navega para a aba Início (Mapa)
              (navigation as any).navigate('Inicio', { screen: 'Home' });

            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.azulClaro, colors.azulEscuro]}
              start={{ x: 0, y: 0 }} // Começa na esquerda
              end={{ x: 1, y: 0 }}   // Termina na direita
              style={styles.returnButtonGradient}
            >
              <Text style={styles.returnButtonText}>Continuar</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}