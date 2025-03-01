import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { getFoodByPage } from '../../../actions/comida/get-food-by-page';


export const HomeScreen = () => {

  const { logout } = useAuthStore();

  getFoodByPage(0);

  return (
    <Layout style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
      <Text> HomeScreen </Text>

      <Button
        onPress={ logout }
        accessoryLeft={ <Icon name="log-out-outline" /> }
      >
        Cerrar Sesión
      </Button>

    </Layout>
  );
};
