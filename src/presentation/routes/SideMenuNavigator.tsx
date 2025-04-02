import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawer } from '../components/ui/CustomDrawer';
import { StackNavigator } from '../navigation/StackNavigator';
import { UserNavigator } from '../navigation/UserNavigation';


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
    </Drawer.Navigator>
  );
};