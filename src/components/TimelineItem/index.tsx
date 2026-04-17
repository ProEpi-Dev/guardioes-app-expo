import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Sequence } from '../../types/trail';
import { getItemStatus } from '../../utils/trailContentStatus';
import { styles } from './styles';
import { colors } from '../../utils/colors';

interface Props {
  seq: Sequence;
  isLastItem: boolean;
  onPressQuiz: (seq: Sequence) => void;
  onPressArticle: (content: any) => void;
}

export const TimelineItem: React.FC<Props> = ({
  seq,
  isLastItem,
  onPressQuiz,
  onPressArticle,
}) => {
  const status = getItemStatus(seq) as string;

  const title =
    seq.form?.title || seq.content?.title || 'Conteúdo desconhecido';
  const description =
    seq.content?.summary || seq.form?.description || 'Teste seus conhecimentos';
  const isQuiz = !!seq.form;

  const isArticle = !!seq.content;
  const thumbnailUrl = isArticle
    ? (seq.content as any).thumbnail_url || (seq.content as any).thumbnailUrl
    : null;

  const hasScore = seq.score !== null && seq.score !== undefined;
  const hasPassingScore =
    seq.passingScore !== null && seq.passingScore !== undefined;

  const attemptNumber = (seq as any).attemptNumber || 0;
  const maxAttempts = (seq as any).maxAttempts;

  const getThemeColors = () => {
    if (status === 'completed') return { main: '#4CAF50', bg: '#4CAF50' };
    if (status === 'failed') return { main: '#D32F2F', bg: '#D32F2F' };
    if (status === 'current' || status === 'available')
      return { main: colors.botãoBem, bg: colors.botãoBem };

    return { main: '#E5E7EB', bg: '#E5E7EB' };
  };

  const theme = getThemeColors();
  const isLocked = status === 'locked';

  const handlePress = () => {
    if (isLocked) return;
    if (seq.form) onPressQuiz(seq);
    else if (seq.content) onPressArticle(seq.content);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.itemContainer}
      onPress={handlePress}
      disabled={isLocked}
    >
      <View style={styles.timelineContainer}>
        {!isLastItem && <View style={styles.verticalLine} />}
        <View style={[styles.nodeCircle, { backgroundColor: theme.bg }]} />
      </View>

      <View style={styles.contentContainer}>
        <View
          style={[
            styles.card,
            {
              borderColor: theme.main,
              opacity: isLocked ? 0.6 : 1,
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
        >
          {thumbnailUrl && (
            <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
          )}

          <View style={[styles.textContainer, { flex: 1 }]}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>

            {isQuiz && !isLocked && (
              <View style={styles.metaContainer}>
                <View style={styles.scoreRow}>
                  <View
                    style={[styles.scoreDot, { backgroundColor: theme.main }]}
                  />
                  <Text style={[styles.scoreText, { color: theme.main }]}>
                    {hasScore ? `${seq.score}/100` : '- /100'}
                  </Text>
                </View>

                {hasPassingScore && (
                  <Text style={styles.metaTextSmall}>
                    Mín: {seq.passingScore}
                  </Text>
                )}

                <Text style={styles.metaTextSmall}>
                  Tentativa: {attemptNumber}
                  {maxAttempts ? `/${maxAttempts}` : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
