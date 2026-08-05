import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTrailParamList, TrackCycle } from '../../../../types/trail';
import { useTrails } from '../../../../hooks/useTrail';
import { styles } from './styles';
import { CustomHeader } from '../../../../components/CustomHeader';
import { useAuth } from '../../../../contexts/AuthContext';
import { colors } from '../../../../utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TrailListItem } from '../../../../components/TrailListItem';
import translate from '../../../../locales/i18n';

type Props = NativeStackScreenProps<RootTrailParamList, 'Home'>;

export default function TrailCard({ navigation }: Props) {
  const { user } = useAuth();
  const { cycles, isLoading, isRefreshing, handleRefresh, error } = useTrails();

  const handlePress = useCallback(
    (item: TrackCycle) => {
      if (
        item.status === 'draft' ||
        item.status === 'archived' ||
        item.isMandatoryLock === true ||
        item.isUpcoming
      ) {
        return;
      }

      navigation.navigate('Accordion', {
        cycleId: item.id,
        title: item.track?.name || item.name,
        isCycleExpired: !!item.isClosed,
      });
    },
    [navigation]
  );

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.principal} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader userName={user?.name} />

      <View style={styles.titleContainer}>
        <MaterialCommunityIcons
          name={'chat-question-outline'}
          size={36}
          color={colors.secundaria}
        />
        <Text style={styles.textTitle}>{translate('learn.title')}</Text>
      </View>

      <FlatList
        style={styles.list}
        data={cycles}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TrailListItem item={item} onPress={handlePress} />
        )}
        contentContainerStyle={styles.contentContainer}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{translate('learn.emptyList')}</Text>
        }
      />
    </View>
  );
}
