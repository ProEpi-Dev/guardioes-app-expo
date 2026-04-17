import { useState, useEffect, useCallback, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { getReportStreaks } from '../services/streaks';

const CACHE_DURATION = 60 * 1000;

export function useStreaks(contextId: number, participationId: number) {
  const [streakData, setStreakData] = useState<any>({
    currentStreak: 0,
    longestStreak: 0,
    totalReports: 0,
  });
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const loadedMonthsRef = useRef<Record<string, number>>({});

  const fetchMonthData = useCallback(
    async (year: number, month: number, forceRefresh = false) => {
      if (!contextId || !participationId) return;

      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      const now = Date.now();
      const lastFetchTime = loadedMonthsRef.current[monthKey] || 0;

      if (!forceRefresh && now - lastFetchTime < CACHE_DURATION) {
        return;
      }

      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

      try {
        setLoading(true);
        const data = await getReportStreaks({
          contextId,
          participationId,
          startDate,
          endDate,
        });

        setStreakData((prev: any) => ({
          ...prev,
          currentStreak:
            data?.currentStreak !== undefined
              ? data.currentStreak
              : prev.currentStreak,
          longestStreak:
            data?.longestStreak !== undefined
              ? data.longestStreak
              : prev.longestStreak,
          totalReports:
            data?.reportedDaysCount !== undefined
              ? data.reportedDaysCount
              : prev.totalReports,
        }));

        if (data?.reportedDays && Array.isArray(data.reportedDays)) {
          setMarkedDates((prevMarks) => {
            const newMarks = { ...prevMarks };

            // 1. Criamos um Set com todas as datas reportadas no mês para busca rápida
            const datasReportadas = new Set(
              data.reportedDays.map((d: any) => d.date)
            );

            data.reportedDays.forEach((day: any) => {
              const dataAtual = day.date; // Ex: "2026-03-15"

              // Função auxiliar para calcular o dia anterior e o próximo de forma segura (sem bugar fuso horário)
              const getDiaAdjacente = (dataStr: string, offset: number) => {
                const d = new Date(dataStr + 'T00:00:00Z');
                d.setUTCDate(d.getUTCDate() + offset);
                return d.toISOString().split('T')[0];
              };

              const diaAnterior = getDiaAdjacente(dataAtual, -1);
              const proximoDia = getDiaAdjacente(dataAtual, 1);

              // Verifica se os dias vizinhos também possuem reporte
              const temAnterior = datasReportadas.has(diaAnterior);
              const temProximo = datasReportadas.has(proximoDia);

              // 2. Monta o objeto no formato exato que o markingType={'period'} exige
              newMarks[dataAtual] = {
                startingDay: !temAnterior, // Começa a pílula se NÃO tem dia anterior
                endingDay: !temProximo, // Termina a pílula se NÃO tem próximo dia
                color: '#A5D6A7', // Cor de fundo (Verde pastel)
                textColor: '#2D3748', // Cor do texto
              };
            });

            return newMarks;
          });
        }

        loadedMonthsRef.current[monthKey] = Date.now();
      } catch (error) {
        console.error('Erro ao buscar calendário:', error);
      } finally {
        setLoading(false);
      }
    },
    [contextId, participationId]
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'report_created',
      () => {
        loadedMonthsRef.current = {};
        const hoje = new Date();
        fetchMonthData(hoje.getFullYear(), hoje.getMonth() + 1, true);
      }
    );
    return () => subscription.remove();
  }, [fetchMonthData]);

  return {
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    totalReports: streakData.totalReports,
    markedDates,
    loading,
    fetchMonthData,
  };
}
