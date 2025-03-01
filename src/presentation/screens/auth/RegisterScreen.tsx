import { Input, Layout, Text, Button, Toggle } from '@ui-kitten/components';
import { Alert, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { useState } from 'react';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'>{}

export const RegisterScreen = ({ navigation }:Props) => {

  const { register } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    username: '',
    apellido_paterno: '',
    apellido_materno: '',
    telefono: '',
    no_empleado: '',
    correo: '',
    password: '',
    password_confirm: '',
  });

  const { height } = useWindowDimensions();

  const onRegister = async() => {

    if (form.nombre.length === 0 || form.username.length === 0 || form.apellido_paterno.length === 0 
        || form.apellido_materno.length === 0 || form.telefono.length === 0 || form.correo.length === 0
        || form.password.length === 0 || form.password_confirm.length === 0
      ) 
    {
      Alert.alert('error', 'Faltan datos de registro');
    }
    setIsPosting(true);
    const wasSuccessful = await register(form.nombre, form.username, form.apellido_paterno, form.apellido_materno, form.telefono, form.no_empleado, 
      form.correo, form.password, form.password_confirm);
    setIsPosting(false);

    if (wasSuccessful) return;
  };

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
              value={ form.nombre }
              onChangeText={ (nombre) => setForm({ ...form, nombre}) }
            />
            <Input
              placeholder="Username:"
              accessoryLeft={ <MyIcon name="person-outline" white /> }
              style={{ marginBottom: 10 }}
              value={ form.username }
              onChangeText={ (username) => setForm({ ...form, username}) }
            />
            <Input
              placeholder="Apellido Paterno:"
              accessoryLeft={ <MyIcon name="person-outline" white /> }
              style={{ marginBottom: 10 }}
              value={ form.apellido_paterno }
              onChangeText={ (apellido_paterno) => setForm({ ...form, apellido_paterno}) }
            />
            <Input
              placeholder="Apellido Materno:"
              accessoryLeft={ <MyIcon name="person-outline" white /> }
              style={{ marginBottom: 10 }}
              value={ form.apellido_materno }
              onChangeText={ (apellido_materno) => setForm({ ...form, apellido_materno}) }
            />
            <Input
              placeholder="Teléfono:"
              keyboardType="phone-pad"
              accessoryLeft={ <MyIcon name="phone-outline" white /> }
              style={{ marginBottom: 10 }}
              value={ form.telefono }
              onChangeText={ (telefono) => setForm({ ...form, telefono}) }
            />
            <Input
              placeholder="No° Empleado:"
              keyboardType="number-pad"
              accessoryLeft={ <MyIcon name="person-outline" white /> }
              style={{ marginBottom: 10 }}
              value={ form.no_empleado }
              onChangeText={ (no_empleado) => setForm({ ...form, no_empleado}) }
            />
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              accessoryLeft={ <MyIcon name="email-outline" white /> }
              style={{ marginBottom: 10 }}
              value={ form.correo }
              onChangeText={ (correo) => setForm({ ...form, correo}) }
            />

            <Input
              placeholder="Contraseña"
              autoCapitalize="none"
              secureTextEntry
              accessoryLeft={ <MyIcon name='lock-outline' white /> }
              style={{ marginBottom: 10 }}
              value={ form.password }
              onChangeText={ (password) => setForm({ ...form, password}) }
            />
            <Input
              placeholder="Confirmar Contraseña"
              autoCapitalize="none"
              secureTextEntry
              accessoryLeft={ <MyIcon name='lock-outline' white /> }
              style={{ marginBottom: 10 }}
              value={ form.password_confirm }
              onChangeText={ (password_confirm) => setForm({ ...form, password_confirm}) }
            />
          </Layout>

          {/* Space */}
          <Layout style={{ height: 10 }} />

          {/* Button */}
          <Layout>
              <Button
                  accessoryRight={ <MyIcon name="arrow-forward-outline" white /> }
                  onPress={ onRegister }
              >
                  Registrarse
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
