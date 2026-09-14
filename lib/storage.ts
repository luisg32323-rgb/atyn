import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyAppState, type AppState } from '@/types';

const STORAGE_KEY = 'atyn.v1.state';

export async function loadAppState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAppState();
    const parsed = JSON.parse(raw) as AppState;
    return {
      session: parsed.session ?? null,
      persona: parsed.persona ?? null,
      pursuits: Array.isArray(parsed.pursuits) ? parsed.pursuits : [],
    };
  } catch {
    return emptyAppState();
  }
}

export async function saveAppState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearAppState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
