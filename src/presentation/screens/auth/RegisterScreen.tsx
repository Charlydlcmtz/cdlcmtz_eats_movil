import { Layout, Text, Button, Toggle } from '@ui-kitten/components';
import { Alert, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { useState } from 'react';
import { UserForm } from '../../components/auth/UserForm';
import { CompanyForm } from '../../components/auth/CompanyForm';
import { prepareImages } from '../../../actions/auth/update-create-user';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'>{}

export const RegisterScreen = ({ navigation }:Props) => {

  const { register } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    username: '',
    apellido_paterno: '',
    apellido_materno: '',
    rfc: '',
    telefono: '',
    no_empleado: '',
    correo: '',
    img_user: '',
    icon: '',
    colors: '',
    password: '',
    password_confirm: '',
  });

  const { height } = useWindowDimensions();

  const onRegister = async() => {

    // Validaciones generales
    if (form.correo.trim() === '' || form.password.trim() === '' || form.password_confirm === '') {
      Alert.alert('Error', 'Correo y contraseña son obligatorios');
      return;
    }

    let tipo_usuario = '';

    // Validaciones por tipo
    if (!isCompany) {
      if (
          form.nombre.trim() === '' || 
          form.username.trim() === '' || 
          form.apellido_paterno.trim() === '' ||
          form.apellido_materno.trim() === '' ||
          form.telefono.trim() === ''
        ) {
        Alert.alert("Error", "Faltan datos de usuario");
        return;
      }
      tipo_usuario = 'usuario';
    }else{
      if (
        form.nombre.trim() === '' ||
        form.rfc.trim() === ''
      ) {
        Alert.alert("Error", "Faltan datos de empresa");
        return;
      }
      tipo_usuario = 'empresa';
    }

    setIsPosting(true);

    const img = await prepareImages(form.img_user, tipo_usuario);

    // Armar los datos segun el tipo
    const payload = isCompany ? {
      nombre: form.nombre,
      rfc: form.rfc,
      correo: form.correo,
      icon: img,
      colors: form.colors,
      password: form.password,
      password_confirm: form.password_confirm,
      tipo_usuario: 'empresa',
    }
    :
    {
      nombre: form.nombre,
      username: form.username,
      apellido_p: form.apellido_paterno,
      apellido_m: form.apellido_materno,
      telefono: form.telefono,
      correo: form.correo,
      img_user: img,
      password: form.password,
      password_confirm: form.password_confirm,
      tipo_usuario: 'usuario',
    };

    const wasSuccessful = await register(payload);

    setIsPosting(false);

    if (!wasSuccessful) {
      Alert.alert("Error", "No se pudo registrar el usuario");
    }

  };

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView
        style={{ marginHorizontal: 40 }}
        contentContainerStyle={{ paddingBottom: 60 }}
      >

          {/* Inputs */}
          <Layout style={{ paddingTop: height * 0.05 }}>
              <Text category="h1">Registrarse</Text>
          </Layout>

          <Layout
            style={{ marginTop: 20 }}
          >
            <Toggle
              checked={isCompany}
              onChange={setIsCompany}
              style={{ right: 70, marginBottom: 20 }}>
            {isCompany ? 'Empresa' : 'Usuario'}
            </Toggle>
            { isCompany ?
              (
                <CompanyForm form={form} setForm={setForm} />
              ) :
              (
                <UserForm form={form} setForm={setForm} />
              )
            }
          </Layout>

          {/* Space */}
          <Layout style={{ height: 10 }} />

          {/* Button */}
          <Layout>
            <Button
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}
              onPress={onRegister}
            >
              Registrarse
            </Button>

            <Layout style={{ marginTop: 10, alignItems: 'center' }}>
              <Text
                status="primary"
                category="s1"
                onPress={() => navigation.goBack()}
              >
                ¿Ya tienes cuenta?
              </Text>
            </Layout>
          </Layout>

          {/* <Layout>
              <Button
                  accessoryRight={ <MyIcon name="arrow-forward-outline" white /> }
                  onPress={ onRegister }
              >
                  Registrarse
              </Button>
          </Layout> */}

          {/* Información para crear cuenta */}
          {/* <Layout style={{ height: 50 }} />
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
          </Layout> */}
      </ScrollView>
    </Layout>
  );
};
