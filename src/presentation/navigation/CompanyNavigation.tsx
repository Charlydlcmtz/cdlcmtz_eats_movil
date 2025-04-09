import { createStackNavigator, StackCardStyleInterpolator } from '@react-navigation/stack';
import { CompaniesScreen } from '../screens/company/CompaniesScreen';
import { CompanyScreen } from '../screens/company/CompanyScreen';

export type RootStackParams = {
  CompaniesScreen: undefined;
  CompanyScreen: { companyId: string };
}

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    }
  }
}


export const CompanyNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="CompaniesScreen"
      screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: fadeAnimation,
    }}>
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="CompaniesScreen"
        component={CompaniesScreen}
      />
      <Stack.Screen
        name="CompanyScreen"
        component={CompanyScreen}
      />
    </Stack.Navigator>
  );
};
