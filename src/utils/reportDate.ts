import dayjs from 'dayjs';
import NetInfo from '@react-native-community/netinfo';

export const nowReportDate = (): string => dayjs().format();

export const reportDateDay = (reportDate: string): string =>
  reportDate.slice(0, 10);

export const todayLocalDay = (): string => dayjs().format('YYYY-MM-DD');

export const isOnline = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    if (state.isConnected === false) return false;
    if (state.isInternetReachable === false) return false;
    return true;
  } catch {
    return true;
  }
};

export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  if (error.status === 0) return true;
  if (error.status === undefined && error.response === undefined) return true;
  return false;
};

export const isRetryableError = (error: any): boolean => {
  if (isNetworkError(error)) return true;
  const status = Number(error?.status ?? error?.response?.status);
  if (!status) return true;
  return status === 401 || status === 408 || status === 429 || status >= 500;
};
