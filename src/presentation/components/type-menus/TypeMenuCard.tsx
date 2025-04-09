import { Card, Text } from '@ui-kitten/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { TypeMenu } from '../../../domain/entities/type-menu';



interface Props {
    typeMenu: TypeMenu;
}

export const TypeMenuCard = ({ typeMenu }: Props) =>  {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

    return (
      <Card
        style={{ flex: 1, backgroundColor: '#F9F9F9', margin: 3  }}
        onPress={ () => navigation.navigate('TypeMenuScreen', { typeMenuId: typeMenu.id})}
      >

        <Text
            numberOfLines={ 2 }
            style={{ textAlign: 'center', color: 'black' }}
        >
            {typeMenu.nombre}
        </Text>

      </Card>
    );
};