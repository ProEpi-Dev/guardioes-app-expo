import { useState, useEffect, useCallback } from 'react';
import { getReportStreaks } from '../services/streaks';

export function useStreaks(contextId: number, participationId: number) {
  const [streakData, setStreakData] = useState<any>({ 
    currentStreak: 0,
    longestStreak: 0,
    totalReports: 0
  });
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());

  const fetchMonthData = useCallback(async (year: number, month: number) => {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    
    if (loadedMonths.has(monthKey)) return;

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

      setLoadedMonths((prev) => new Set(prev).add(monthKey));

    } catch (error) {
      console.error('Erro ao buscar calendário:', error);
    } finally {
      setLoading(false);
    }
  }, [contextId, participationId, loadedMonths]);

  useEffect(() => {
    const hoje = new Date();
    fetchMonthData(hoje.getFullYear(), hoje.getMonth() + 1);
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