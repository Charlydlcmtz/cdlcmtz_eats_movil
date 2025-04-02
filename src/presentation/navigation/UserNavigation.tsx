import { createStackNavigator, StackCardStyleInterpolator } from '@react-navigation/stack';
import { UsersScreen } from '../screens/users/UsersScreen';
import { UserScreen } from '../screens/users/UserScreen';

export type RootStackParams = {
  UsersScreen: undefined;
  UserScreen: { userId: string };
}

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    }
  }
}


export const UserNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="UsersScreen"
      screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: fadeAnimation,
    }}>
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="UsersScreen"
        component={UsersScreen}
      />
      <Stack.Screen
        name="UserScreen"
        component={UserScreen}
      />
    </Stack.Navigator>
  );
};
