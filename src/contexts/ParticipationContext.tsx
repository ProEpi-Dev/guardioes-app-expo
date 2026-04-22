import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '../utils/api';

interface ParticipationContextData {
  participationId: number | null;
  contextId: number | null;
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
  const [loadingParticipation, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchParticipation = async () => {
      if (!user?.email) {
        setParticipationId(null);
        setContextId(null);
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

        // console.log(`[ParticipationContext] Buscando usuário: /v1/users?${userParams.toString()}`);

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

        // console.log(`[ParticipationContext] Buscando participação: /v1/participations?${partParams.toString()}`);

        const partRes: any = await apiClient(
          `/v1/participations?${partParams.toString()}`,
          { method: 'GET' }
        );
        const partList = partRes.data || partRes || [];

        if (Array.isArray(partList) && partList.length > 0) {
          const myParticipation = partList[0];

          if (isActive) {
            // console.log(`[ParticipationContext] Sucesso! ID: ${myParticipation.id}`);
            setParticipationId(myParticipation.id);
            setContextId(myParticipation.contextId);
          }
        } else {
          console.warn(
            '[ParticipationContext] Nenhuma participação ativa encontrada para este userId.'
          );
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

  return (
    <ParticipationContext.Provider
      value={{ participationId, contextId, loadingParticipation }}
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
