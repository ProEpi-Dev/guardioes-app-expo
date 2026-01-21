import { useState, useEffect, useCallback } from 'react';
import { getArticles } from '../services/article';
import { Article } from '../types/article';

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      
      setError(null);
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError('Não foi possível carregar os artigos.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);
  
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleRefresh = () => {
    fetchArticles(true);
  };

  return {
    articles,
    isLoading,
    isRefreshing,
    error,
    handleRefresh,
  };
};