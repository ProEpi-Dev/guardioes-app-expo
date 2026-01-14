import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '../utils/api';

interface ParticipationContextData {
  participationId: number | null;
  loadingParticipation: boolean;
}

const ParticipationContext = createContext<ParticipationContextData>({} as ParticipationContextData);

export function ParticipationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [participationId, setParticipationId] = useState<number | null>(null);
  const [loadingParticipation, setLoading] = useState(false);

  useEffect(() => {
    const fetchParticipation = async () => {
      if (!user?.email) return;

      setLoading(true);
      console.log(`[ParticipationContext] Iniciando busca inteligente para: ${user.email}`);

      try {
        let foundUserId: number | null = null;
        let page = 1;
        const PAGE_SIZE = 50;
        let hasMoreUsers = true;
        while (hasMoreUsers && !foundUserId) {
          console.log(`[ParticipationContext] Buscando usuários - Página ${page}...`);
          
          try {
            const usersRes: any = await apiClient(`/v1/users?page=${page}&pageSize=${PAGE_SIZE}`, { method: 'GET' });
            const usersList = usersRes.data || usersRes || [];

            if (!Array.isArray(usersList) || usersList.length === 0) {
              hasMoreUsers = false;
              break;
            }

            const targetUser = usersList.find((u: any) => 
              u.email?.trim().toLowerCase() === user.email.trim().toLowerCase()
            );

            if (targetUser) {
              foundUserId = targetUser.id;
              console.log(`[ParticipationContext] ✅ Usuário encontrado na página ${page}. ID: ${foundUserId}`);
            } else {
              if (usersList.length < PAGE_SIZE) {
                hasMoreUsers = false;
              } else {
                page++;
              }
            }
          } catch (err) {
            console.error(`[ParticipationContext] Erro ao buscar página ${page} de usuários`, err);
            hasMoreUsers = false;
          }
        }

        if (!foundUserId) {
          console.warn('[ParticipationContext] ❌ Usuário não encontrado em nenhuma página.');
          return;
        }

        let foundParticipationId: number | null = null;
        page = 1;
        let hasMorePart = true;

        while (hasMorePart && !foundParticipationId) {
          console.log(`[ParticipationContext] Buscando participações - Página ${page}...`);
          
          try {
            const partRes: any = await apiClient(`/v1/participations?page=${page}&pageSize=${PAGE_SIZE}`, { method: 'GET' });
            const partList = partRes.data || partRes || [];

            if (!Array.isArray(partList) || partList.length === 0) {
              hasMorePart = false;
              break;
            }

            const myParticipation = partList.find((p: any) => 
               (p.userId == foundUserId) && p.active === true
            );

            if (myParticipation) {
              foundParticipationId = myParticipation.id;
              console.log(`[ParticipationContext] ✅ Participação encontrada na página ${page}. ID: ${foundParticipationId}`);
            } else {
              if (partList.length < PAGE_SIZE) {
                hasMorePart = false;
              } else {
                page++;
              }
            }
          } catch (err) {
            console.error(`[ParticipationContext] Erro ao buscar página ${page} de participações`, err);
            hasMorePart = false;
          }
        }

        if (foundParticipationId) {
          setParticipationId(foundParticipationId);
        } else {
          console.warn(`[ParticipationContext] ❌ Nenhuma participação ATIVA encontrada para o UserID ${foundUserId}`);
        }

      } catch (error) {
        console.error('[ParticipationContext] Erro fatal geral:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipation();
  }, [user]);

  return (
    <ParticipationContext.Provider value={{ participationId, loadingParticipation }}>
      {children}
    </ParticipationContext.Provider>
  );
}

export const useParticipationId = () => {
    const context = useContext(ParticipationContext);
    return context.participationId;
};

export const useParticipation = () => useContext(ParticipationContext);