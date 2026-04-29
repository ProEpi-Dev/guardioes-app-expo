import { useState, useEffect, useCallback } from 'react';
import { getArticles, getContentTypes } from '../services/article';
import { Article, ContentType } from '../types/article';
import { useParticipation } from '../contexts/ParticipationContext';

export const useArticles = () => {
  const { contextId } = useParticipation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      setError(null);
      const [articlesData, typesData] = await Promise.all([
        getArticles(contextId),
        getContentTypes(),
      ]);

      setArticles(articlesData);
      setContentTypes(typesData);
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
    contentTypes,
    isLoading,
    isRefreshing,
    error,
    handleRefresh,
  };
};
