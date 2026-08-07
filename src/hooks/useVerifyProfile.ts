import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getProfileStatus } from '../services/finishProfile';

export function useVerifyProfile() {
  const navigation = useNavigation<any>();

  const { data: profileStatus, isLoading } = useQuery({
    queryKey: ['profile-status'],
    queryFn: () => getProfileStatus(),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!isLoading && profileStatus && !profileStatus.isComplete) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'FinishProfile' }],
      });
    }
  }, [profileStatus, isLoading, navigation]);
}
