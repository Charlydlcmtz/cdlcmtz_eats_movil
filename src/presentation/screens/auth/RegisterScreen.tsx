import { Layout, Text, Button, Toggle } from '@ui-kitten/components';
import { Alert, Image, StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { useState } from 'react';
import { UserForm } from '../../components/auth/UserForm';
import { CompanyForm } from '../../components/auth/CompanyForm';
import { prepareImages } from '../../../actions/auth/update-create-user';
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'>{}

export const RegisterScreen = ({ navigation }:Props) => {

  const { register } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const styles = createStyles(isDarkMode);
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
      Toast.show({
        type: 'error',
        text1: 'Campos Obligatorios',
        text2: 'Correo y contraseña son obligatorios.',
      });
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
          Toast.show({
            type: 'error',
            text1: 'Campos Obligatorios',
            text2: 'Faltan datos de usuario.',
          });
          return;
      }
      tipo_usuario = 'usuario';
    }else{
      if (
        form.nombre.trim() === '' ||
        form.rfc.trim() === ''
      ) {
        Toast.show({
          type: 'error',
          text1: 'Campos Obligatorios',
          text2: 'Faltan datos de empresa.',
        });
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
        style={{ marginHorizontal: 0 }}
        contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 60 }}
          showsVerticalScrollIndicator={true}
          indicatorStyle="black" // o 'white' si estás en dark mode
      >
        {/* Imagen superior */}
        <Layout style={{ alignItems: 'center', paddingTop: height * 0.05 }}>
          <Image
            source={require('../../../assets/register.png')}
            style={{ width: 150, height: 150, marginBottom: 10 }}
          />
          <Layout style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MyIcon name="person-add-outline" fill="#3366FF" style={{ width: 30, height: 30, marginRight: 8 }} />
            <Text category="h1">Registrarse</Text>
          </Layout>
        </Layout>

        {/* Toggle empresa / usuario */}
        <Layout style={{ marginTop: 20, alignItems: 'center' }}>
          <Toggle
            status={isDarkMode ? 'primary' : 'info'} // más contraste en modo claro
            checked={isCompany}
            onChange={setIsCompany}
            style={styles.toggle}
          >
            {isCompany ? 'Registrarse como Empresa' : 'Registrarse como Usuario'}
          </Toggle>
        </Layout>

        {/* Formulario dinámico */}
        {isCompany
          ? <CompanyForm form={form} setForm={setForm} showErrors={showErrors} />
          : <UserForm form={form} setForm={setForm} showErrors={showErrors} />
        }

        {/* Space */}
        <Layout style={{ height: 10 }} />

        {/* Botón */}
        <Layout style={{ marginTop: 20 }}>
          <Button
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            onPress={onRegister}
            disabled={isPosting}
            style={styles.boton}
          >
            {isPosting ? 'Registrando...' : 'Registrarse'}
          </Button>
        </Layout>

        {/* Navegación */}
        <Layout style={{ marginTop: 15, alignItems: 'center' }}>
          <Text style={styles.text} onPress={() => navigation.navigate('LoginScreen')}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    toggle: {
      marginBottom: 20,
      backgroundColor: isDarkMode ? '#2C2C2C' : '#B3E5FC', // Fondo del track
      borderRadius: 20,
      padding: 4,
    },
    boton: {
      backgroundColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
      borderRadius: 10,
    },
    text: {
      color: '#0dfc05',
    },
});