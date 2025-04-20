import 'react-native-gesture-handler';

import * as eva from '@eva-design/eva';
import Toast from 'react-native-toast-message';
import { toastConfig } from './config/ui/toastConfig'; // 👈 ajusta el path si lo mueves
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { useColorScheme } from 'react-native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AuthProvider } from './presentation/providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SideMenuNavigator } from './presentation/routes/SideMenuNavigator';
import { useAuthStore } from './presentation/store/auth/useAuthStore';
import { AuthStackNavigator } from './presentation/navigation/AuthStackNavigator';
import { CartProvider } from './presentation/context/CartContext';
import { lightTheme } from './presentation/theme/lightTheme';

const queryClient = new QueryClient();

export const FoodApp = () => {
  const { status } = useAuthStore();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : lightTheme;

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#03A9F4', // 👈 fondo de toda la navegación
      card: '#03A9F4',
      text: '#ffffff',
      border: '#03A9F4',
      primary: '#ffffff',
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
        <CartProvider>
          <NavigationContainer theme={navTheme}>
            <AuthProvider>
              { status === 'authenticated'
                ? <SideMenuNavigator />
                : <AuthStackNavigator />
              }
              <Toast config={toastConfig} />
            </AuthProvider>
          </NavigationContainer>
        </CartProvider>
      </ApplicationProvider>
    </QueryClientProvider>
  );
};