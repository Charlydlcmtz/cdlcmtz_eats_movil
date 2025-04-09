import { createStackNavigator, StackCardStyleInterpolator } from "@react-navigation/stack";
import { TypeMenusScreen } from "../screens/type-menu/TypeMenusScreen";
import { TypeMenuScreen } from "../screens/type-menu/TypeMenuScreen";


export type RootStackParams = {
  TypeMenusScreen: undefined;
  TypeMenuScreen: { typeMenuId: string };
}

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    }
  }
}

export const TypeMenuNavigator = () => {
  return (
    <Stack.Navigator
        initialRouteName="TypeMenusScreen"
        screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: fadeAnimation,
    }}>
        <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="TypeMenusScreen"
        component={TypeMenusScreen}
        />
        <Stack.Screen
        name="TypeMenuScreen"
        component={TypeMenuScreen}
        />
    </Stack.Navigator>
  );
};
