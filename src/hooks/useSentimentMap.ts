import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../utils/api';

export function useSentimentMap() {
  const [mapPoints, setMapPoints] = useState<any[]>([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const fetchPoints = useCallback(async () => {
    setLoadingPoints(true);
    try {
      const today = new Date();
      const startDaysAgo = new Date();

      startDaysAgo.setDate(today.getDate() - 7);

      const formatDate = (d: Date) => d.toISOString().split('T')[0];

      const response: any = await apiClient(
        `/v1/reports/points?startDate=${formatDate(startDaysAgo)}&endDate=${formatDate(today)}`,
        { method: 'GET' }
      );

      const points = Array.isArray(response) ? response : response.data || [];
      setMapPoints(points);
    } catch (error) {
      console.error('Erro points:', error);
    } finally {
      setLoadingPoints(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  return { mapPoints, loadingPoints, refreshPoints: fetchPoints };
}
