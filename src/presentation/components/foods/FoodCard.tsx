import { Card, Text } from '@ui-kitten/components';
import { Food } from '../../../domain/entities/food';
import { Image } from 'react-native';
import { FadeInImage } from '../ui/FadeInImage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';

interface Props {
    food: Food;
}

export const FoodCard = ({ food }: Props) =>  {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

    return (
      <Card
        style={{ flex: 1, backgroundColor: '#F9F9F9', margin: 3  }}
        onPress={ () => navigation.navigate('FoodScreen', { foodId: food.id})}
      >

        {
          food.img_comida === '' || food.img_comida === null
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
                uri={ food.img_comida }
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
            {food.platillo}
          </Text>

      </Card>
    );
};