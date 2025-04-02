import { Input, Layout, Text, Button } from '@ui-kitten/components';
import { Alert, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth/useAuthStore';

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'>{}

export const LoginScreen = ({ navigation }:Props) => {

    const { login } = useAuthStore();
    const [isPosting, setIsPosting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        correo: '',
        password: '',
    });

    const { height } = useWindowDimensions();

    const onLogin = async() => {
        if ( form.correo.length === 0 || form.password.length === 0) {
            return;
        }

        setIsPosting(true);
        const wasSuccessful = await login(form.correo, form.password);
        setIsPosting(false);

        if (wasSuccessful) return;

        Alert.alert('error', 'Usuario o contraseña incorrectos');
    }

    const EyeIcon = () => (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MyIcon
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            white
          />
        </TouchableOpacity>
    );

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
                    value={ form.correo }
                    onChangeText={ (correo) => setForm({ ...form, correo }) }
                    accessoryLeft={ <MyIcon name="email-outline" white /> }
                    style={{ marginBottom: 10 }}
                />

                <Input
                    placeholder="Contraseña"
                    autoCapitalize="none"
                    secureTextEntry={ !showPassword }
                    value={ form.password }
                    onChangeText={ (password) => setForm({ ...form, password }) }
                    accessoryLeft={ <MyIcon name='lock-outline' white /> }
                    accessoryRight={EyeIcon}
                    style={{ marginBottom: 10 }}
                />
            </Layout>

            {/* Space */}
            <Layout style={{ height: 10 }} />

            {/* Button */}
            <Layout>
                <Button
                    disabled={isPosting}
                    accessoryRight={ <MyIcon name="arrow-forward-outline" white /> }
                    onPress={onLogin}
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
