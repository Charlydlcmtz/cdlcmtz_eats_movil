import { Card, Text } from '@ui-kitten/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { Order } from '../../../domain/entities/order';



interface Props {
    order: Order;
}

export const OrderCard = ({ order }: Props) =>  {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

    return (
      <Card
        style={{ flex: 1, backgroundColor: '#F9F9F9', margin: 3  }}
        onPress={ () => navigation.navigate('OrderScreen', { orderId: order.id})}
      >

        <Text
            numberOfLines={ 2 }
            style={{ textAlign: 'center', color: 'black' }}
        >
            {order.usuario.username}
        </Text>

      </Card>
    );
};