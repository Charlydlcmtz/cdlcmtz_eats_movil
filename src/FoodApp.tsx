import 'react-native-gesture-handler';

import * as eva from '@eva-design/eva';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { useColorScheme } from 'react-native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AuthProvider } from './presentation/providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SideMenuNavigator } from './presentation/routes/SideMenuNavigator';
import { useAuthStore } from './presentation/store/auth/useAuthStore';
import { AuthStackNavigator } from './presentation/navigation/AuthStackNavigator';

const queryClient = new QueryClient();

export const FoodApp = () => {
  const { status } = useAuthStore();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : eva.light;
  const backgroundColor = (colorScheme === 'dark')
  ? '#222B45'
  : '#F7F9FC';

  const navTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: backgroundColor,
      card: backgroundColor,
      text: '#1A2138',
      border: '#E4E9F2',
      primary: '#3366FF',
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: 'normal' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: 'bold' },
    },
  };

  return (
    <QueryClientProvider client={ queryClient }>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
        <NavigationContainer theme={navTheme}>
          <AuthProvider>
            { status === 'authenticated'
              ? <SideMenuNavigator />
              : <AuthStackNavigator />
            }
          </AuthProvider>
        </NavigationContainer>
      </ApplicationProvider>
    </QueryClientProvider>
  );
};