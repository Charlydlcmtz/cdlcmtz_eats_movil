import { Input, Layout, Text, Button } from '@ui-kitten/components';
import { Alert, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth/useAuthStore';

interface Props extends StackScreenProps<RootStackParams, 'ForgotScreen'>{}

export const ForgotScreen = ({ navigation }:Props) => {

    const { forgotPassword } = useAuthStore();
    const [isPosting, setIsPosting] = useState(false);
    const [form, setForm] = useState({
        correo: '',
    });

    const { height } = useWindowDimensions();

    const onSendEmail = async() => {

        // Validaciones generales
        if (form.correo.trim() === '') {
          Alert.alert('Error', 'El correo es obligatorio');
          return;
        }

        setIsPosting(true);
        const resp = await forgotPassword(form.correo, 'app_movil');
        setIsPosting(false);

        if (resp.estatus !== 'success') {
            Alert.alert("Error", resp.mensaje || "No se pudo enviar el correo");
            return;
        }

        Alert.alert("Éxito", resp.mensaje || "Correo enviado correctamente");
        setForm({correo: ''});
      };

    return (
       <Layout style={{ flex: 1 }}>
        <ScrollView style={{ marginHorizontal: 40 }}>

            {/* Inputs */}
            <Layout style={{ paddingTop: height * 0.35 }}>
                <Text category="h1">Olvidaste la Contraseña</Text>
            </Layout>

            <Layout style={{ marginTop: 20 }}>
                <Input
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessoryLeft={ <MyIcon name="email-outline" white /> }
                    style={{ marginBottom: 10 }}
                    value={ form.correo }
                    onChangeText={ (correo) => setForm({ ...form, correo}) }
                />
            </Layout>

            {/* Space */}
            <Layout style={{ height: 10 }} />

            {/* Button */}
            <Layout>
                <Button
                    accessoryRight={ <MyIcon name="refresh-outline" white /> }
                    onPress={onSendEmail}
                    disabled={isPosting}
                >
                    {isPosting ? 'Enviando...' : 'Recuperar Contraseña'}
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
                    onPress={() => navigation.navigate('LoginScreen')}
                >
                    {' '}
                    ¿Ya tienes cuenta?{' '}
                </Text>
            </Layout>

        </ScrollView>
       </Layout>
    );
};
