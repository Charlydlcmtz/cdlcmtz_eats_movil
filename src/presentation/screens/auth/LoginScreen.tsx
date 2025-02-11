import { Input, Layout, Text, Button } from '@ui-kitten/components';
import { useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'>{}

export const LoginScreen = ({ navigation }:Props) => {

    const { height } = useWindowDimensions();

    return (
       <Layout style={{ flex: 1 }}>
        <ScrollView style={{ marginHorizontal: 40 }}>

            {/* Inputs */}
            <Layout style={{ paddingTop: height * 0.35 }}>
                <Text category="h1" >Login</Text>
            </Layout>

            <Layout style={{ marginTop: 20 }}>
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
            </Layout>

            {/* Space */}
            <Layout style={{ height: 10 }} />

            {/* Button */}
            <Layout>
                <Button
                    accessoryRight={ <MyIcon name="arrow-forward-outline" white /> }
                    onPress={() => navigation.navigate('HomeScreen')}
                >
                    Login
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
                    status='success'
                    onPress={() => navigation.navigate('RegisterScreen')}
                >
                    ¿No tienes cuenta?
                </Text>
                <Text
                    status='primary'
                    category='s1'
                    onPress={() => navigation.navigate('ForgotScreen')}
                >
                    {' '}
                    ¿Olvidaste tu Contraseña?{' '}
                </Text>
            </Layout>

        </ScrollView>
       </Layout>
    );
};
