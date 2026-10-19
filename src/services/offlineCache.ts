import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGNAL_FORM_KEY = (contextId: number) =>
  `@guardioes/cache:signal_form:${contextId}`;
const LOCATIONS_KEY = '@guardioes/cache:locations';
const COMPLIANCE_KEY = (participationId: number) =>
  `@guardioes/cache:compliance:${participationId}`;

interface CacheEntry<T> {
  savedAt: string;
  value: T;
}

const write = async <T>(key: string, value: T): Promise<void> => {
  try {
    const entry: CacheEntry<T> = { savedAt: new Date().toISOString(), value };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn('[offlineCache] Falha ao gravar', key, error);
  }
};

const read = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    return entry?.value ?? null;
  } catch (error) {
    console.warn('[offlineCache] Falha ao ler', key, error);
    return null;
  }
};

export const setCachedSignalForm = (contextId: number, form: any) =>
  write(SIGNAL_FORM_KEY(contextId), form);

export const getCachedSignalForm = (contextId: number) =>
  read<any>(SIGNAL_FORM_KEY(contextId));

export const setCachedLocations = (locations: any[]) =>
  write(LOCATIONS_KEY, locations);

export const getCachedLocations = () => read<any[]>(LOCATIONS_KEY);

export const setCachedCompliance = (
  participationId: number,
  isCompliant: boolean
) => write(COMPLIANCE_KEY(participationId), isCompliant);

export const getCachedCompliance = (participationId: number) =>
  read<boolean>(COMPLIANCE_KEY(participationId));
