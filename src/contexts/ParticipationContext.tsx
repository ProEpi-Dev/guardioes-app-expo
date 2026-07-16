import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '../utils/api';
import { ContextModuleCode } from '../types/auth';

interface ParticipationContextData {
  participationId: number | null;
  contextId: number | null;
  modules: ContextModuleCode[];
  isEventBased: boolean;
  loadingParticipation: boolean;
}

const ParticipationContext = createContext<ParticipationContextData>(
  {} as ParticipationContextData
);

export function ParticipationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [participationId, setParticipationId] = useState<number | null>(null);
  const [contextId, setContextId] = useState<number | null>(null);
  const [modules, setModules] = useState<ContextModuleCode[]>([]);
  const [loadingParticipation, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    // Caminho preferencial: a participação já veio no login (sem requests).
    const loginParticipation = user?.participation;
    if (loginParticipation?.id && loginParticipation.context?.id) {
      setParticipationId(loginParticipation.id);
      setContextId(loginParticipation.context.id);
      setModules(loginParticipation.context.modules ?? []);
      setLoading(false);
      return;
    }

    // Fallback: sessões antigas (logadas antes deste update) que não têm
    // a participation persistida. Não chama /v1/contexts.
    const fetchParticipation = async () => {
      if (!user?.email) {
        setParticipationId(null);
        setContextId(null);
        setModules([]);
        if (isActive) setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const userParams = new URLSearchParams({
          page: '1',
          pageSize: '1',
          active: 'true',
          search: user.email.trim(),
        });

        const usersRes: any = await apiClient(
          `/v1/users?${userParams.toString()}`,
          { method: 'GET' }
        );
        const usersList = usersRes.data || usersRes || [];

        const targetUser = usersList.find(
          (u: any) =>
            u.email?.trim().toLowerCase() === user.email?.trim().toLowerCase()
        );

        if (!targetUser) {
          console.warn(
            '[ParticipationContext] Usuário não encontrado na busca por email.'
          );
          if (isActive) setLoading(false);
          return;
        }

        const foundUserId = targetUser.id;

        const partParams = new URLSearchParams({
          page: '1',
          pageSize: '1',
          active: 'true',
          userId: foundUserId.toString(),
        });

        const partRes: any = await apiClient(
          `/v1/participations?${partParams.toString()}`,
          { method: 'GET' }
        );
        const partList = partRes.data || partRes || [];

        if (Array.isArray(partList) && partList.length > 0) {
          const myParticipation = partList[0];
          if (isActive) {
            setParticipationId(myParticipation.id);
            setContextId(myParticipation.contextId);
            setModules([]);
          }
        } else {
          console.warn(
            '[ParticipationContext] Nenhuma participação ativa encontrada para este userId.'
          );
          if (isActive) setModules([]);
        }
      } catch (error) {
        console.error(
          '[ParticipationContext] Erro ao carregar contexto:',
          error
        );
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchParticipation();

    return () => {
      isActive = false;
    };
  }, [user]);

  const isEventBased = modules.includes('community_signal');

  return (
    <ParticipationContext.Provider
      value={{
        participationId,
        contextId,
        modules,
        isEventBased,
        loadingParticipation,
      }}
    >
      {children}
    </ParticipationContext.Provider>
  );
}

export const useParticipationId = () => {
  const context = useContext(ParticipationContext);
  return context.participationId;
};

export const useParticipation = () => useContext(ParticipationContext);
