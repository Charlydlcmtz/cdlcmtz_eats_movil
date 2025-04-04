import { Card, Text } from '@ui-kitten/components';
import { Image } from 'react-native';
import { FadeInImage } from '../ui/FadeInImage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { Company } from '../../../domain/entities/company';


interface Props {
    company: Company;
}

export const CompanyCard = ({ company }: Props) =>  {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

    return (
      <Card
        style={{ flex: 1, backgroundColor: '#F9F9F9', margin: 3  }}
        onPress={ () => navigation.navigate('CompanyScreen', { companyId: company.id})}
      >

        {
          company.icon === '' || company.icon === null || company.icon.includes("/null")
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
                uri={ company.icon }
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
            {company.nombre}
          </Text>

      </Card>
    );
};