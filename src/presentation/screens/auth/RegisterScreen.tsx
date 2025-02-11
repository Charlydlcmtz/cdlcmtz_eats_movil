import { Input, Layout, Text, Button, Toggle } from '@ui-kitten/components';
import { useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'>{}

export const RegisterScreen = ({ navigation }:Props) => {

    const { height } = useWindowDimensions();

    return (
       <Layout style={{ flex: 1 }}>
        <ScrollView style={{ marginHorizontal: 40 }}>

            {/* Inputs */}
            <Layout style={{ paddingTop: height * 0.05 }}>
                <Text category="h1">Registrarse</Text>
            </Layout>

            <Layout 
              style={{ marginTop: 20 }}
            >
              <Toggle style={{ 
                right: 70,
                marginBottom: 20
              }}>
                Usuario / Empresa
              </Toggle>
              <Input
                placeholder="Nombre:"
                accessoryLeft={ <MyIcon name="person-outline" white /> }
                style={{ marginBottom: 10 }}
              />
              <Input
                placeholder="Username:"
                accessoryLeft={ <MyIcon name="person-outline" white /> }
                style={{ marginBottom: 10 }}
              />
              <Input
                placeholder="Apellido Paterno:"
                accessoryLeft={ <MyIcon name="person-outline" white /> }
                style={{ marginBottom: 10 }}
              />
              <Input
                placeholder="Apellido Materno:"
                accessoryLeft={ <MyIcon name="person-outline" white /> }
                style={{ marginBottom: 10 }}
              />
              <Input
                placeholder="Teléfono:"
                keyboardType="phone-pad"
                accessoryLeft={ <MyIcon name="phone-outline" white /> }
                style={{ marginBottom: 10 }}
              />
              <Input
                placeholder="No° Empleado:"
                keyboardType="number-pad"
                accessoryLeft={ <MyIcon name="person-outline" white /> }
                style={{ marginBottom: 10 }}
              />
              <Input
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                accessoryLeft={ <MyIcon name="email-outline" white /> }
                style={{ marginBottom: 10 }}
              />

              <Input
                placeholder="Contraseña"
                autoCapitalize="none"
                secureTextEntry
                accessoryLeft={ <MyIcon name='lock-outline' white /> }
                style={{ marginBottom: 10 }}
              />
              <Input
                placeholder="Confirmar Contraseña"
                autoCapitalize="none"
                secureTextEntry
                accessoryLeft={ <MyIcon name='lock-outline' white /> }
                style={{ marginBottom: 10 }}
              />
            </Layout>

            {/* Space */}
            <Layout style={{ height: 10 }} />

            {/* Button */}
            <Layout>
                <Button
                    accessoryRight={ <MyIcon name="arrow-forward-outline" white /> }
                    onPress={() => navigation.navigate('HomeScreen')}
                >
                    Ingresar
                </Button>
            </Layout>

            {/* Información para crear cuenta */}
            <Layout style={{ height: 50 }} />

            <Layout 
            style={{
                alignItems: 'flex-end',
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <Text
                  status='primary'
                  category='s1'
                  onPress={() => navigation.goBack()}
                >
                  ¿Ya tienes cuenta?
                </Text>
            </Layout>

        </ScrollView>
       </Layout>
    );
};
