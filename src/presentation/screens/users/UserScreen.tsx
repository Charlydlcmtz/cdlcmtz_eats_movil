import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { RootStackParams } from '../../navigation/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { MainLayout } from '../../layouts/MainLayout';
import { Formik } from 'formik';
import { CameraAdapter } from '../../../config/adapters/camera-adapter';
import { Alert, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { IndexPath, Input, Layout, Text } from '@ui-kitten/components';
import { MyIcon } from '../../components/ui/MyIcon';
import { UserImage } from '../../components/users/UserImage';
import { User } from '../../../domain/entities/user';
import { getUserById, updateCreateUser } from '../../../actions/usuarios';
import * as Yup from 'yup';
import { getCompanys } from '../../../actions/empresas/get-empresas-by-role';
import { FAB } from '../../components/ui/FAB';
import { CustomSelect } from '../../components/ui/CustomSelect';
import Toast from 'react-native-toast-message';
import { isAxiosError } from 'axios';

interface Props extends StackScreenProps<RootStackParams, 'UserScreen'>{}

// 👇 Aquí lo defines
type FormUser = User & {
  password?: string;
  confirmPassword?: string;
  id_empresa?: string;
};

const emptyUser: FormUser = {
  id: '',
  nombre: '',
  apellido_p: '',
  apellido_m: '',
  username: '',
  no_empleado: '',
  img_user: '',
  correo: '',
  telefono: '',
  id_empresa: '',
  password: '',
  confirmPassword: '',
  // role: UserRole;
  estatus: 1,
};

export const UserScreen = ({ route }: Props) => {
  const userIdRef = useRef(route.params.userId);
  const queryClient = useQueryClient();
  const isCreating = userIdRef.current === 'new';
  const isDarkMode = useColorScheme() === 'dark';
  const styles = createStyles(isDarkMode);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));

  const { data: empresas = [], isLoading: loadingEmpresas } = useQuery({
    queryKey: ['empresas'],
    queryFn: getCompanys,
  });

  //useQuery
  const { data: user } = useQuery({
    queryKey: ['user', userIdRef.current ],
    queryFn: () => getUserById(userIdRef.current),
  });

  //useMutation
  const mutation = useMutation({
    mutationFn: (data: User ) => updateCreateUser({... data, id: userIdRef.current}),
    onSuccess( data: User){
      const id = data?.id ?? userIdRef.current;
      userIdRef.current = id; // creación
      queryClient.invalidateQueries({ queryKey: ['users', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
    },
  });

  if (!user) {
    return (<MainLayout title="Cargando..." />);
  }

  const userSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    username: Yup.string().required('El username es obligatorio'),
    apellido_p: Yup.string().required('El apellido paterno es obligatorio'),
    apellido_m: Yup.string().required('El apellido materno es obligatorio'),
    telefono: Yup.string().required('El teléfono es obligatorio'),
    // no_empleado: Yup.string().required('El número de empleado es obligatorio'),
    correo: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
    // id_empresa: Yup.string().required('La empresa es obligatoria'),
    password: Yup.string().when([], {
      is: () => isCreating,
      then: schema => schema.required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
      otherwise: schema => schema.notRequired(),
    }),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
  });

    return (
      <Formik <FormUser>
        enableReinitialize
        initialValues={user || emptyUser}
        validationSchema={userSchema}
        onSubmit={(values) => {
          const { confirmPassword, password, ...rest } = values;

          const finalData: User = {
            ...rest,
            ...(password ? { password } : {}),
            id: userIdRef.current,
          };

          mutation.mutate(finalData);
        }}
      >
        {
          ({ handleChange, handleSubmit, values, errors, touched, setFieldValue, resetForm  }) => (
            <MainLayout
              title={ values.nombre }
              subTitle={ `Usuario: ${values.username}` }
              rightAction={() => {
                Alert.alert(
                  'Selecciona una opción',
                  '¿Qué deseas hacer?',
                  [
                    {
                      text: 'Tomar foto',
                      onPress: async () => {
                        const img = await CameraAdapter.takePicture();
                        setFieldValue('img_user', img);
                      },
                    },
                    {
                      text: 'Elegir de galería',
                      onPress: async () => {
                        const img = await CameraAdapter.getPicturesFromLibrary();
                        setFieldValue('img_user', img);
                      },
                    },
                    { text: 'Cancelar', style: 'cancel' },
                  ],
                  { cancelable: true }
                );
              }}
              rightActionIcon="camera-outline"
            >
              {/* View principal que contiene ScrollView + FAB */}
              <View style={{ flex: 1, position: 'relative' }}>
                <ScrollView style={{ flex: 1 }}>
                  {/* Imagenes de la comida */}
                  <Layout style= {{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <UserImage image={values.img_user} />
                  </Layout>

                  {/* Formulario */}
                  <Layout style={{ marginHorizontal: 10 }}>
                    <Input
                      label="Nombre"
                      value={ values.nombre }
                      accessoryLeft={ <MyIcon name="person-outline" white /> }
                      onChangeText={handleChange('nombre')}
                      style={styles.input}
                      status={touched.nombre && errors.nombre ? 'danger' : 'basic'}
                      caption={touched.nombre && errors.nombre ? errors.nombre : ''}
                    />
                    <Input
                      label="Username"
                      value={ values.username }
                      accessoryLeft={ <MyIcon name="person-outline" white /> }
                      onChangeText={handleChange('username')}
                      style={styles.input}
                      status={touched.username && errors.username ? 'danger' : 'basic'}
                      caption={touched.username && errors.username ? errors.username : ''}
                    />
                    <Input
                      label="Apellido Paterno"
                      value={ values.apellido_p }
                      accessoryLeft={ <MyIcon name="person-outline" white /> }
                      onChangeText={handleChange('apellido_p')}
                      style={styles.input}
                      status={touched.apellido_p && errors.apellido_p ? 'danger' : 'basic'}
                      caption={touched.apellido_p && errors.apellido_p ? errors.apellido_p : ''}
                    />
                    <Input
                      label="Apellido Materno"
                      value={ values.apellido_m }
                      accessoryLeft={ <MyIcon name="person-outline" white /> }
                      onChangeText={handleChange('apellido_m')}
                      style={styles.input}
                      status={touched.apellido_m && errors.apellido_m ? 'danger' : 'basic'}
                      caption={touched.apellido_m && errors.apellido_m ? errors.apellido_m : ''}
                    />
                    <Input
                      label="Teléfono"
                      keyboardType="phone-pad"
                      value={ values.telefono }
                      accessoryLeft={ <MyIcon name="phone-outline" white /> }
                      onChangeText={handleChange('telefono')}
                      style={styles.input}
                      status={touched.telefono && errors.telefono ? 'danger' : 'basic'}
                      caption={touched.telefono && errors.telefono ? errors.telefono : ''}
                    />
                    <Input
                      label="Numero Empleado"
                      value={ values.no_empleado }
                      keyboardType="number-pad"
                      accessoryLeft={ <MyIcon name="briefcase-outline" white /> }
                      onChangeText={handleChange('no_empleado')}
                      style={styles.input}
                      status={touched.no_empleado && errors.no_empleado ? 'danger' : 'basic'}
                      caption={touched.no_empleado && errors.no_empleado ? errors.no_empleado : ''}
                    />
                    <Input
                      label="Correo"
                      value={ values.correo }
                      keyboardType="email-address"
                      autoCapitalize="none"
                      accessoryLeft={ <MyIcon name="email-outline" white /> }
                      onChangeText={handleChange('correo')}
                      style={styles.input}
                      status={touched.correo && errors.correo ? 'danger' : 'basic'}
                      caption={touched.correo && errors.correo ? errors.correo : ''}
                    />
                    <Layout style={styles.input}>
                      <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Empresa</Text>
                      <CustomSelect
                        options={empresas.map(e => ({
                          label: e.nombre,
                          value: e.id,
                        }))}
                        selectedValue={values.id_empresa}
                        onValueChange={(val) => setFieldValue('id_empresa', val)}
                      />

                      {touched.id_empresa && errors.id_empresa && (
                        <Text style={{ color: 'red', marginTop: 5 }}>{errors.id_empresa}</Text>
                      )}
                    </Layout>
                    <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Estatus</Text>
                    <CustomSelect
                      options={[
                        { label: 'Activo', value: 1 },
                        { label: 'Inactivo', value: 0 },
                      ]}
                      selectedValue={values.estatus}
                      onValueChange={(val) => setFieldValue('estatus', val)}
                    />
                  </Layout>

                  {/* Contraseña (solo si aplica) */}
                  {(isCreating || values.password) && (
                    <Layout style={{ marginHorizontal: 10 }}>
                      <Input
                        label="Contraseña"
                        value={values.password}
                        accessoryLeft={<MyIcon name="lock-outline" white />}
                        onChangeText={handleChange('password')}
                        style={styles.input}
                        secureTextEntry
                        status={touched.password && errors.password ? 'danger' : 'basic'}
                        caption={touched.password && errors.password ? errors.password : ''}
                      />
                      <Input
                        label="Confirmar contraseña"
                        value={values.confirmPassword}
                        accessoryLeft={<MyIcon name="lock-outline" white />}
                        onChangeText={handleChange('confirmPassword')}
                        style={styles.input}
                        secureTextEntry
                        status={touched.confirmPassword && errors.confirmPassword ? 'danger' : 'basic'}
                        caption={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}
                      />
                    </Layout>
                  )}

                  {mutation.isError && (
                    <Text style={{ color: 'red', marginHorizontal: 10 }}>
                      {mutation.error instanceof Error
                        ? mutation.error.message
                        : 'Ocurrió un error inesperado'}
                    </Text>
                  )}

                  <Layout style={{ height: 200 }}  />
                </ScrollView>
                {/* FAB flotante fuera del scroll */}
                {/* // Dentro del return 👇 */}
                <FAB
                  iconName={isSaving ? "clock-outline" : "save-outline"}
                  onPress={async () => {
                    setIsSaving(true);
                    try {
                      await mutation.mutateAsync({
                        ...values,
                        id: isCreating ? '' : values.id, // o foodIdRef.current
                      });

                      Toast.show({
                        type: 'success',
                        text1: isCreating ? 'Registro exitoso' : 'Actualización exitosa',
                        text2: isCreating ? 'El elemento ha sido creado correctamente' : 'Los cambios fueron guardados',
                      });

                      if (isCreating) {
                        resetForm(); // limpia formulario
                        queryClient.invalidateQueries({ queryKey: ['users'] }); // o el queryKey correspondiente
                      }

                    } catch (error) {
                      if (isAxiosError(error)) {
                        const mensaje = error.response?.data?.mensaje;

                        if (Array.isArray(mensaje)) {
                          // Errores de validación: mostrar todos
                          mensaje.forEach(msg => {
                            Toast.show({
                              type: 'error',
                              text1: 'Error de validación',
                              text2: msg,
                            });
                          });
                        } else {
                          // Error general
                          Toast.show({
                            type: 'error',
                            text1: 'Error al guardar',
                            text2: mensaje || 'Error desconocido',
                          });
                        }
                      } else {
                        Toast.show({
                          type: 'error',
                          text1: 'Error inesperado',
                          text2: 'Algo salió mal. Intenta más tarde.',
                        });
                      }
                    } finally {
                      setTimeout(() => setIsSaving(false), 600);
                    }
                  }}
                  disabled={isSaving}
                  style={styles.fab_boton}
                />
              </View>
            </MainLayout>
          )
        }
      </Formik>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    input: {
      marginVertical: 5,
      backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF20',
      borderColor: isDarkMode ? '#555' : '#FFFFFF55',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    fab_boton: {
      backgroundColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
      position: 'absolute',
      bottom: 150,
      right: 10,
    },
});
