import { Input, Layout, Text, Button } from '@ui-kitten/components';
import { StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth/useAuthStore';
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<RootStackParams, 'ForgotScreen'>{}

export const ForgotScreen = ({ navigation }:Props) => {

    const { forgotPassword } = useAuthStore();
    const [isPosting, setIsPosting] = useState(false);
    const isDarkMode = useColorScheme() === 'dark';
    const styles = createStyles(isDarkMode);
    const [form, setForm] = useState({
        correo: '',
    });

    const { height } = useWindowDimensions();

    const onSendEmail = async() => {

        // Validaciones generales
        if (form.correo.trim() === '') {
            Toast.show({
                type: 'error',
                text1: 'Campo Obligatorio',
                text2: 'El correo es obligatorio.',
            });
            return;
        }

        setIsPosting(true);
        const resp = await forgotPassword(form.correo, 'app_movil');
        setIsPosting(false);

        if (resp.estatus !== 'success') {
            Toast.show({
                type: 'error',
                text1: 'Error Correo',
                text2: resp.mensaje || "No se pudo enviar el correo.",
            });
            return;
        }

        Toast.show({
            type: 'success',
            text1: 'Enviado',
            text2: resp.mensaje || "Correo enviado correctamente",
        });
        setForm({correo: ''});
      };

    return (
       <Layout style={{ flex: 1 }}>
        <ScrollView style={{ marginHorizontal: 40 }}>

            {/* Inputs */}
            <Layout style={{ paddingTop: height * 0.35 }}>
                <Text category="h1">Recuperar Contraseña</Text>
            </Layout>

            <Layout style={{ marginTop: 20 }}>
                <Input
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessoryLeft={ <MyIcon name="email-outline" white /> }
                    style={styles.input}
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
                    style={styles.boton}
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
                    style={styles.text}
                    onPress={() => navigation.navigate('RegisterScreen')}
                >
                    ¿No tienes cuenta?
                </Text>
                <Text
                    style={styles.text_olvido}
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

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    input: {
        marginBottom: 10,
        backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF20',
        borderColor: isDarkMode ? '#555' : '#FFFFFF55',
        color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    boton: {
        marginTop: 30,
        backgroundColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
        borderRadius: 10,
    },
    text: {
        color: '#0dfc05',
    },
    text_olvido: {
        color: isDarkMode ? '#031bf4' : '#7B1FA2',
    },
});
