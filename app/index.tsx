import { Redirect } from 'expo-router';
import { useApp } from '@/context/AppContext';

/** Gate: auth → persona → tabs */
export default function Index() {
  const { session, personaComplete } = useApp();

  if (!session) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!personaComplete) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return <Redirect href="/(tabs)/today" />;
}
