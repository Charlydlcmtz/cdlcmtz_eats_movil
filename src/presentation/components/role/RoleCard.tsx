import { Card, Text } from '@ui-kitten/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { Role } from '../../../domain/entities/role';



interface Props {
    role: Role;
}

export const RoleCard = ({ role }: Props) =>  {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

    return (
      <Card
        style={{ flex: 1, backgroundColor: '#F9F9F9', margin: 3  }}
        onPress={ () => navigation.navigate('RoleScreen', { roleId: role.id})}
      >

        <Text
            numberOfLines={ 2 }
            style={{ textAlign: 'center', color: 'black' }}
        >
            {role.nombre}
        </Text>

      </Card>
    );
};