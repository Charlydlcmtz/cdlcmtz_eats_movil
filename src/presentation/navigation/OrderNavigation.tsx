import { createStackNavigator, StackCardStyleInterpolator } from "@react-navigation/stack";
import { OrdersScreen } from "../screens/orders/OrdersScreen";
import { OrderScreen } from "../screens/orders/OrderScreen";


export type RootStackParams = {
  OrdersScreen: undefined;
  OrderScreen: { orderId: string };
}

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    }
  }
}

export const OrderNavigator = () => {
  return (
    <Stack.Navigator
        initialRouteName="OrdersScreen"
        screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: fadeAnimation,
    }}>
        <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="OrdersScreen"
        component={OrdersScreen}
        />
        <Stack.Screen
        name="OrderScreen"
        component={OrderScreen}
        />
    </Stack.Navigator>
  );
};
