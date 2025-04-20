import { Layout, Text } from '@ui-kitten/components';
import { Food } from '../../../domain/entities/food';
import { Image, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';

interface Props {
  food: Food;
}

export const FoodCard = ({ food }: Props) =>  {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('FoodScreen', { foodId: food.id })}
        style={{
          flex: 1,
          margin: 10,
          borderRadius: 15,
          width: '100%',
          height: 250,
          overflow: 'hidden',
          backgroundColor: '#fff',
          elevation: 4, // sombra en Android
          shadowColor: '#000', // sombra en iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        }}
      >
        {/* Imagen que ocupa todo el contenedor */}
        <Image
          source={{ uri: food.img_comida }}
          style={{
            width: '100%',
            height: 160,
          }}
          resizeMode="cover"
        />

        {/* Contenido textual debajo */}
        <Layout style={{ padding: 10 }}>
          <Text category="s1" style={{ fontWeight: 'bold' }} numberOfLines={1}>
            {food.platillo}
          </Text>
          <Text appearance="hint" category="c1" numberOfLines={2}>
            Descripción: {food.descripcion}
          </Text>
          <Text category="s2" style={{ marginTop: 5 }}>
            Precio: ${Number(food.costo).toFixed(2)}
          </Text>
        </Layout>
      </TouchableOpacity>
    );
};