import { useState, useEffect, useCallback, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { getReportStreaks } from '../services/streaks';

const CACHE_DURATION = 60 * 1000;

export function useStreaks(contextId: number, participationId: number) {
  const [streakData, setStreakData] = useState<any>({ 
    currentStreak: 0,
    longestStreak: 0,
    totalReports: 0
  });
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  
  const loadedMonthsRef = useRef<Record<string, number>>({});

  const fetchMonthData = useCallback(async (year: number, month: number, forceRefresh = false) => {
    if (!contextId || !participationId) return;
    
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const now = Date.now();
    const lastFetchTime = loadedMonthsRef.current[monthKey] || 0;
    
    if (!forceRefresh && (now - lastFetchTime < CACHE_DURATION)) {
      return;
    }

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    try {
      setLoading(true);
      const data = await getReportStreaks({ contextId, participationId, startDate, endDate });
      
      setStreakData((prev: any) => ({ 
        ...prev, 
        currentStreak: data?.currentStreak !== undefined ? data.currentStreak : prev.currentStreak,
        longestStreak: data?.longestStreak !== undefined ? data.longestStreak : prev.longestStreak,
        totalReports: data?.reportedDaysCount !== undefined ? data.reportedDaysCount : prev.totalReports
      }));
      
      if (data?.reportedDays && Array.isArray(data.reportedDays)) {
        setMarkedDates((prevMarks) => {
          const newMarks = { ...prevMarks };
          data.reportedDays.forEach((day: any) => {
            newMarks[day.date] = {
              customStyles: {
                container: {
                  backgroundColor: '#96d398',
                  borderRadius: 18,
                  height: 36, 
                  width: 36,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                text: { color: '#2D3748', fontWeight: 'bold' }
              }
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
  }, [contextId, participationId]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('report_created', () => {
      loadedMonthsRef.current = {};
      const hoje = new Date();
      fetchMonthData(hoje.getFullYear(), hoje.getMonth() + 1, true);
    });
    return () => subscription.remove();
  }, [fetchMonthData]);

  return { 
    currentStreak: streakData.currentStreak, 
    longestStreak: streakData.longestStreak,
    totalReports: streakData.totalReports,
    markedDates, 
    loading, 
    fetchMonthData 
  };
}