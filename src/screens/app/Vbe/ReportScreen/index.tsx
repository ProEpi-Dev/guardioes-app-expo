import React, { useEffect, useState, useMemo } from 'react';
import { Alert, DeviceEventEmitter, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../../../../contexts/AuthContext';
import { useSentimentLogic } from '../../../../hooks/useSentimentLogic';
import { useVbeReports } from '../../../../hooks/useVbeReport';
import { getReportById } from '../../../../services/reports';
import translate from '../../../../locales/i18n';

import { CustomHeader } from '../../../../components/CustomHeader';
import { FeelingCard } from '../../../../components/FeelingCard';
import { SentimentModal } from '../../../../components/SentimentModal';
import { ReportDetailsModal } from '../../../../components/VBE/ReportDetailsModal';
import { FilterDrawer } from '../../../../components/FilterDrawer';

import { SuccessOverlay } from '../../../../components/SuccessOverlay';
import { ListHeader } from './ListHeader';
import { ReportList } from './ReportList';

export function Vbe() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 60 + insets.bottom;

  const {
    onFeelingSelected,
    showForm,
    setShowForm,
    formDefinition,
    formTitle,
    loadingForm,
    sending,
    setFormValues,
    handleSubmitForm,
    isCompliant: logicCompliant,
    showSuccessAnimation,
    setShowSuccessAnimation,
  } = useSentimentLogic();

  const [isCompliant, setIsCompliant] = useState(logicCompliant);
  const { report, refetch, isRefetching } = useVbeReports();

  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  // Fetches detalhes do modal quando o usuário clica em um item
  const { data: reportDetails, isFetching: isFetchingDetails } = useQuery({
    queryKey: ['report-details', selectedReportId],
    queryFn: () => getReportById(selectedReportId!),
    enabled: !!selectedReportId,
  });

  useEffect(() => {
    setIsCompliant(logicCompliant);
  }, [logicCompliant]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'force_compliance_update',
      (status) => setIsCompliant(status)
    );
    return () => subscription.remove();
  }, []);

  const handleFeelingSelection = (feeling: 'good' | 'bad') => {
    if (onFeelingSelected) {
      onFeelingSelected(feeling);
    } else {
      const message =
        feeling === 'good'
          ? translate('report.goodChoice')
          : translate('report.badChoice');
      Alert.alert(
        translate('vbe.alerts.feelingRegistered'),
        translate('vbe.alerts.youSelected', { message })
      );
    }
  };

  const contentTypes = useMemo(() => {
    if (!report) return [];
    const labels = report.map(
      (item) => item.integrationSummary?.externalSignalStageLabel
    );
    const validLabels = labels.filter((label): label is string => !!label);
    const uniqueLabels = Array.from(new Set(validLabels));
    return uniqueLabels.map((label, index) => ({
      id: index + 1,
      name: label,
      color: '#666666',
    }));
  }, [report]);

  const filteredReports = useMemo(() => {
    if (!report) return [];
    if (selectedFilters.length === 0) return report;
    const selectedNames = contentTypes
      .filter((type) => selectedFilters.includes(type.id))
      .map((type) => type.name);
    return report.filter(
      (item) =>
        item.integrationSummary?.externalSignalStageLabel &&
        selectedNames.includes(item.integrationSummary.externalSignalStageLabel)
    );
  }, [report, selectedFilters, contentTypes]);

  const handleToggleFilter = (id: number) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  const selectedIntegrationData = report?.find(
    (r) => r.id === selectedReportId
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f5f7' }}>
      <CustomHeader userName={user?.name} />

      <View style={{ flex: 1, paddingBottom: TAB_BAR_HEIGHT }}>
        <View style={{ height: 180, width: '100%', zIndex: 10 }}>
          <FeelingCard
            onFeelingSelected={handleFeelingSelection}
            isCompliant={isCompliant}
            padBottom={0}
            bottomOffset={0}
            goodButtonText={translate('vbe.feelingCard.nothingHappened')}
            badButtonText={translate('vbe.feelingCard.report')}
            title={translate('vbe.feelingCard.title')}
          />
        </View>

        {/* COMPONENTE 1: Cabeçalho com o botão de Filtro */}
        <ListHeader
          filterCount={selectedFilters.length}
          onOpenFilter={() => setIsDrawerOpen(true)}
          onRefresh={refetch}
          isRefetching={isRefetching}
        />

        {/* COMPONENTE 2: Lista de Relatórios */}
        <ReportList
          data={filteredReports}
          isRefetching={isRefetching}
          onRefresh={refetch}
          onSelectReport={setSelectedReportId}
        />
      </View>

      {/* COMPONENTE 3: Animação de Sucesso isolada */}
      <SuccessOverlay
        visible={showSuccessAnimation}
        onAnimationEnd={() => setShowSuccessAnimation(false)}
      />

      {/* Outros Modais já existentes */}
      <FilterDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        contentTypes={contentTypes}
        selectedFilters={selectedFilters}
        onToggleFilter={handleToggleFilter}
        onClearFilters={() => setSelectedFilters([])}
      />

      <SentimentModal
        visible={showForm}
        onClose={() => setShowForm(false)}
        loading={loadingForm}
        sending={sending}
        formDefinition={formDefinition}
        onFormChange={setFormValues}
        onSubmit={handleSubmitForm}
        title={formTitle}
      />

      <ReportDetailsModal
        visible={selectedReportId !== null}
        loading={isFetchingDetails}
        data={reportDetails}
        integrationData={selectedIntegrationData}
        onClose={() => setSelectedReportId(null)}
      />
    </View>
  );
}
