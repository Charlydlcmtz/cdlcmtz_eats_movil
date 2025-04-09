import { createStackNavigator, StackCardStyleInterpolator } from "@react-navigation/stack";
import { TypeMenusScreen } from "../screens/type-menu/TypeMenusScreen";
import { TypeMenuScreen } from "../screens/type-menu/TypeMenuScreen";
import { RolesScreen } from "../screens/roles/RolesScreen";
import { RoleScreen } from "../screens/roles/RoleScreen";


export type RootStackParams = {
  RolesScreen: undefined;
  RoleScreen: { roleId: string };
}

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    }
  }
}

export const RoleNavigator = () => {
  return (
    <Stack.Navigator
        initialRouteName="RolesScreen"
        screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: fadeAnimation,
    }}>
        <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="RolesScreen"
        component={RolesScreen}
        />
        <Stack.Screen
        name="RoleScreen"
        component={RoleScreen}
        />
    </Stack.Navigator>
  );
};
