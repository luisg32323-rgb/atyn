import { Redirect, Stack } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { colors } from '@/constants/theme';

export default function AuthLayout() {
  const { session } = useApp();

  if (session) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="email" options={{ headerShown: true, title: 'Email magic link' }} />
    </Stack>
  );
}
