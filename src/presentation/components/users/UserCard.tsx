import { Card, Text } from '@ui-kitten/components';
import { Image } from 'react-native';
import { FadeInImage } from '../ui/FadeInImage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { User } from '../../../domain/entities/user';

interface Props {
    user: User;
}

export const UserCard = ({ user }: Props) =>  {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

    return (
      <Card
        style={{ flex: 1, backgroundColor: '#F9F9F9', margin: 3  }}
        onPress={ () => navigation.navigate('UserScreen', { userId: user.id})}
      >

        {
          user.img_user === '' || user.img_user === null || user.img_user.includes("/null")
          ? (
            <Image
              source={ require('../../../assets/no-product-image.png') }
              style={{
                width: '100%',
                height: 200,
                resizeMode: 'cover', // Ajusta la imagen correctamente
              }}
            />)
            : (
              <FadeInImage
                uri={ user.img_user }
                style={{
                  width: '100%',
                  height: 200,
                  resizeMode: 'cover', // Aplica el mismo ajuste a ambas imágenes
                }}
              />
            )
          }

          <Text
            numberOfLines={ 2 }
            style={{ textAlign: 'center', color: 'black' }}
          >
            {user.username}
          </Text>

      </Card>
    );
};