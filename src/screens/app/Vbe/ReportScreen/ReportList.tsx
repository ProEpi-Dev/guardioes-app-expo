import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardReport } from '../../../../components/VBE/cardReport';
import translate from '../../../../locales/i18n';

interface ReportListProps {
  data: any[];
  isRefetching: boolean;
  onRefresh: () => void;
  onSelectReport: (id: number) => void;
}

export function ReportList({
  data,
  isRefetching,
  onRefresh,
  onSelectReport,
}: ReportListProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ height: 350, width: '100%', paddingBottom: insets.bottom }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelectReport(item.id)}>
            <CardReport data={item} />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 50 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={['#007BFF']}
            tintColor="#007BFF"
          />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#666' }}>
            {translate('vbe.emptyList')}
          </Text>
        }
      />
    </View>
  );
}
