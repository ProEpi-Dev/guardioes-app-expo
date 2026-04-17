import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { useQuizInfo } from '../../../hooks/useQuizInfo';
import { CustomHeader } from '../../../components/CustomHeader';
import { useAuth } from '../../../contexts/AuthContext';
import { colors } from '../../../utils/colors';

export function QuizInfoScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const {
    title,
    currentAttempt,
    maxAttempts,
    timeLimitMinutes,
    linkedArticle,
    loadingContent,
    handleStartQuiz,
    handleGoToContent,
    passingScore,
  } = useQuizInfo();

  const bottomBarHeight = 60 + insets.bottom;

  return (
    <View style={styles.container}>
      <CustomHeader userName={user?.name} showBackButton={true} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomBarHeight + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecalho extra baseado no Figma */}
        <View style={styles.headerTitles}>
          <Text style={styles.trailTitle}>{title}</Text>
          <View style={styles.separator} />
          <Text style={styles.evaluationTitle}>Avaliação</Text>
        </View>

        <View style={styles.instructionsContainer}>
          <View style={styles.iconHeader}>
            <Feather name="info" size={26} color={colors.secundaria} />
            <Text style={styles.sectionTitle}>Instruções</Text>
          </View>

          <View style={styles.bulletsContainer}>
            <Text style={styles.instructionText}>
              • Este quiz contém perguntas de múltipla escolha
            </Text>
            <Text style={styles.instructionText}>
              • O objetivo é testar seus conhecimentos sobre "{title}"
            </Text>
            <Text style={styles.instructionText}>
              • Leia atentamente cada questão antes de responder
            </Text>
            {passingScore !== undefined && passingScore !== null && (
              <Text style={styles.instructionText}>
                • Nota mínima para aprovação: {passingScore} pontos
              </Text>
            )}
            <Text style={styles.instructionText}>
              • Ao finalizar, sua nota será calculada automaticamente
            </Text>
            {timeLimitMinutes ? (
              <Text style={styles.instructionText}>
                • Tempo limite: {timeLimitMinutes} minutos
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.attemptContainer}>
          <View style={styles.orangeCircle}>
            <Text style={styles.orangeIcon}>i</Text>
          </View>
          <Text style={styles.attemptLabel}>Você está iniciando a</Text>
          <Text style={styles.attemptNumber}>{currentAttempt}ª Tentativa</Text>
          <Text style={styles.attemptSub}>
            {maxAttempts && maxAttempts > 0
              ? `de ${maxAttempts} tentativas permitidas`
              : 'Tentativas ilimitadas'}
          </Text>
        </View>

        {/* Botões empilhados */}
        <View style={styles.footer}>
          {linkedArticle && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGoToContent}
              disabled={loadingContent}
            >
              {loadingContent ? (
                <ActivityIndicator color={colors.secundaria} />
              ) : (
                <Text style={styles.secondaryButtonText}>Revisar conteúdo</Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.primaryButtonContainer}
            onPress={handleStartQuiz}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.azulClaro, colors.azulEscuro]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Iniciar Quiz</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
