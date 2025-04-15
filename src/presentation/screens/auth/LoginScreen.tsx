import { Input, Layout, Text, Button } from '@ui-kitten/components';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth/useAuthStore';
import Toast from 'react-native-toast-message';

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

        if (!wasSuccessful){
            Toast.show({
                type: 'error',
                text1: 'Credenciales incorrectas',
                text2: 'Verifica tu correo y contraseña.',
            });
        }
    };

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
        <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingTop: height * 0.15 }}>

            {/* Inputs */}
            <Layout  style={{ alignItems: 'center', marginBottom: 40, paddingTop: height * 0.13 }}>
                <Text category="h1" style={{ fontWeight: 'bold' }}>Bienvenido</Text>
                <Text appearance="hint" category="s1">Inicia sesión para continuar</Text>
            </Layout>

            <Layout style={{ gap: 15 }}>
          <Input
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.correo}
            onChangeText={(correo) => setForm({ ...form, correo })}
            accessoryLeft={<MyIcon name="email-outline" white />}
          />

          <Input
            placeholder="Contraseña"
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(password) => setForm({ ...form, password })}
            accessoryLeft={<MyIcon name="lock-outline" white />}
            accessoryRight={EyeIcon}
          />
        </Layout>

            <Button
                style={{ marginTop: 30 }}
                disabled={isPosting}
                onPress={onLogin}
                accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            >
                Iniciar sesión
            </Button>

            <Layout
                style={{
                    marginTop: 30,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: 4,
                }}
            >
                <Text status='success' onPress={() => navigation.navigate('RegisterScreen')}>
                    ¿No tienes cuenta?
                </Text>
                <Text status='primary' category='s1' onPress={() => navigation.navigate('ForgotScreen')}>
                    ¿Olvidaste tu contraseña?
                </Text>
            </Layout>
        </ScrollView>
       </Layout>
    );
};
