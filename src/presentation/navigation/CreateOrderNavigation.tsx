import { createStackNavigator, StackCardStyleInterpolator } from "@react-navigation/stack";
import { CreateOrderScreen } from '../screens/pedidos/CreateOrderScreen';
import { FoodDetailScreen } from "../screens/pedidos/FoodDetailScreen";
import { CartScreen } from '../screens/pedidos/CartScreen';


export type RootStackParams = {
  CreateOrderScreen: undefined;
  FoodDetailScreen: { menuId: string };
  CartScreen:  undefined;
}

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    }
  }
}

export const CreateOrderNavigator = () => {
  return (
    <Stack.Navigator
        initialRouteName="CreateOrderScreen"
        screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: fadeAnimation,
    }}>
        <Stack.Screen
          options={{ cardStyleInterpolator: fadeAnimation }}
          name="CreateOrderScreen"
          component={CreateOrderScreen}
        />
        <Stack.Screen
          name="FoodDetailScreen"
          component={FoodDetailScreen}
        />
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
        />
    </Stack.Navigator>
  );
};
