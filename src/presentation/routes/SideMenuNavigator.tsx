import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawer } from '../components/ui/CustomDrawer';
import { StackNavigator } from '../navigation/StackNavigator';
import { UserNavigator } from '../navigation/UserNavigation';
import { CompanyNavigator } from '../navigation/CompanyNavigation';
import { TypeMenuNavigator } from '../navigation/TypeMenuNavigator';
import { RoleNavigator } from '../navigation/RoleNavigation';
import { OrderNavigator } from '../navigation/OrderNavigation';
import { CreateOrderNavigator } from '../navigation/CreateOrderNavigation';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '../store/auth/useAuthStore';
import { RoutePermissions } from '../constants/role-permissions';


const Drawer = createDrawerNavigator();

export const SideMenuNavigator = () => {
  const { user } = useAuthStore();
  const userRole = user?.role.nombre ?? ''; // ej. 'Admin_Role'

  const hasAccess = (routeName: keyof typeof RoutePermissions): boolean =>
    RoutePermissions[routeName]?.includes(userRole);
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        headerTitleStyle: {
          fontWeight: 'normal',
        },
        headerTitleAlign: 'center',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
          color: '#fff',
        },
        drawerActiveTintColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
        drawerActiveBackgroundColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
        drawerInactiveTintColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
        drawerItemStyle: {
          borderRadius: 100,
          paddingHorizontal: 20,
        },
      }}
    >
      {hasAccess('Inicio') && (
        <Drawer.Screen
          name="Inicio"
          component={StackNavigator}
          options={{ title: 'Inicio' }}
        />
      )}
      {hasAccess('Usuarios') && (
        <Drawer.Screen
          name="Usuarios"
          component={UserNavigator}
          options={{ title: 'Usuarios' }}
        />
      )}
      {hasAccess('Empresas') && (
        <Drawer.Screen
          name="Empresas"
          component={CompanyNavigator}
          options={{ title: 'Empresas' }}
        />
      )}
      {hasAccess('Ordenes') && (
        <Drawer.Screen
          name="Ordenes"
          component={OrderNavigator}
          options={{ title: 'Ordenes' }}
        />
      )}
      {hasAccess('Pedir') && (
        <Drawer.Screen
          name="Pedir"
          component={CreateOrderNavigator}
          options={{ title: 'Pedir' }}
        />
      )}
      {hasAccess('Tipos Menu') && (
        <Drawer.Screen
          name="Tipos de Menu"
          component={TypeMenuNavigator}
          options={{ title: 'Tipos Menu' }}
        />
      )}
      {hasAccess('Roles') && (
        <Drawer.Screen
          name="Roles"
          component={RoleNavigator}
          options={{ title: 'Roles' }}
        />
      )}
    </Drawer.Navigator>
  );
};