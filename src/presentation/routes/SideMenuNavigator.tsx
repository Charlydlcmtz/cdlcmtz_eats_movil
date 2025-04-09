import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawer } from '../components/ui/CustomDrawer';
import { StackNavigator } from '../navigation/StackNavigator';
import { UserNavigator } from '../navigation/UserNavigation';
import { CompanyNavigator } from '../navigation/CompanyNavigation';
import { TypeMenuNavigator } from '../navigation/TypeMenuNavigator';
import { RoleNavigator } from '../navigation/RoleNavigation';
import { OrderNavigator } from '../navigation/OrderNavigation';
import { CreateOrderNavigator } from '../navigation/CreateOrderNavigation';


const Drawer = createDrawerNavigator();

export const SideMenuNavigator = () => {
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
        },
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: 'skyblue',
        drawerInactiveTintColor: 'skyblue',
        drawerItemStyle: {
          borderRadius: 100,
          paddingHorizontal: 20,
        },
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={StackNavigator}
        options={{ title: 'Inicio' }}
      />
      <Drawer.Screen
        name="Usuarios"
        component={UserNavigator}
        options={{ title: 'Usuarios' }}
      />
      <Drawer.Screen
        name="Empresas"
        component={CompanyNavigator}
        options={{ title: 'Empresas' }}
      />
      <Drawer.Screen
        name="Ordenes"
        component={OrderNavigator}
        options={{ title: 'Ordenes' }}
      />
      <Drawer.Screen
        name="Pedir"
        component={CreateOrderNavigator}
        options={{ title: 'Pedir' }}
      />
      <Drawer.Screen
        name="Tipos de Menu"
        component={TypeMenuNavigator}
        options={{ title: 'Tipos Menu' }}
      />
      <Drawer.Screen
        name="Roles"
        component={RoleNavigator}
        options={{ title: 'Roles' }}
      />
    </Drawer.Navigator>
  );
};