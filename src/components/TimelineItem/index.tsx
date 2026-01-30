import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Sequence } from '../../types/trail';
import { getItemStatus, getItemTheme } from '../../utils/trailContentStatus';
import { styles } from './styles';


interface Props {
  seq: Sequence;
  isLastItem: boolean;
  onPressQuiz: (seq: Sequence) => void;
  onPressArticle: (content: any) => void;
}

const iconColors: Record<string, string> = {
  locked: '#000',
  current: '#000',
  completed: '#fff',
  failed: '#fff',
  default: '#fff'
};

export const TimelineItem: React.FC<Props> = ({ seq, isLastItem, onPressQuiz, onPressArticle }) => {
  const status = getItemStatus(seq);
  const theme = getItemTheme(status);
  const title = seq.form?.title || seq.content?.title || 'Conteúdo desconhecido';
  const isQuiz = !!seq.form;

  const handlePress = () => {
    if (status === 'locked') return;
    if (seq.form) onPressQuiz(seq);
    else if (seq.content) onPressArticle(seq.content);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={styles.itemContainer}
      onPress={handlePress}
      disabled={status === 'locked'}
    >
      {/* Esquerda: Linha do Tempo */}
      <View style={styles.timelineContainer}>
        {!isLastItem && <View style={styles.verticalLine} />}
        <View style={[styles.nodeCircle, { backgroundColor: theme.bg, borderColor: theme.borderColor }]}>
            <Feather name={theme.icon as any} size={14} color={iconColors[status] || iconColors.default} />
        </View>
      </View>

      {/* Direita: Conteúdo */}
      <View style={styles.contentContainer}>
        <Text style={[styles.itemTitle, status === 'locked' && styles.lockedText]}>
          {title}
        </Text>
        
        {/* Detalhes do Quiz */}
        {isQuiz && status !== 'locked' && (
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Text style={[styles.metaTextBold, { color: theme.lightColor }]}>
                 {seq.score !== null && seq.score !== undefined ? `${seq.score}/100` : '- /100'}
              </Text>
              
              {seq.passingScore !== null && seq.passingScore !== undefined && (
                <Text style={styles.metaTextSmall}>
                   (Mín: {seq.passingScore})
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};