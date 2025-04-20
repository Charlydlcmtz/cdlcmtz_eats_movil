import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { RootStackParams } from '../../navigation/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { MainLayout } from '../../layouts/MainLayout';
import { Formik } from 'formik';
import { CameraAdapter } from '../../../config/adapters/camera-adapter';
import { Alert, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Input, Layout, Text } from '@ui-kitten/components';
import { MyIcon } from '../../components/ui/MyIcon';
import * as Yup from 'yup';
import { FAB } from '../../components/ui/FAB';
import { Empresa } from '../../../domain/entities/company';
import { getCompanyById } from '../../../actions/empresas/get-company-by-id';
import { updateCreateCompany } from '../../../actions/empresas/update-create-company';
import { CompanyImage } from '../../components/companies/CompanyImage';
import Toast from 'react-native-toast-message';
import { isAxiosError } from 'axios';

interface Props extends StackScreenProps<RootStackParams, 'CompanyScreen'>{}

// 👇 Aquí lo defines
type FormCompany = Empresa & {
  password?: string;
  confirmPassword?: string;
};

const emptyCompany: FormCompany = {
    id: '',
    nombre: '',
    rfc: '',
    telefono: '',
    correo: '',
    icon: '',
    colors: '',
    password: '',
    confirmPassword: '',
    estatus: true,
};

export const CompanyScreen = ({ route }: Props) => {
  const companyIdRef = useRef(route.params.companyId);
  const queryClient = useQueryClient();
  const isCreating = companyIdRef.current === 'new';
  const isDarkMode = useColorScheme() === 'dark';
  const styles = createStyles(isDarkMode);
  const [isSaving, setIsSaving] = useState(false);

  //useQuery
  const { data: company } = useQuery({
    queryKey: ['company', companyIdRef.current ],
    queryFn: () => getCompanyById(companyIdRef.current),
  });

  //useMutation
  const mutation = useMutation({
    mutationFn: (data: Empresa ) => updateCreateCompany({... data, id: companyIdRef.current}),
    onSuccess( data: Empresa){
      const id = data?.id ?? companyIdRef.current;
      companyIdRef.current = id; // creación
      queryClient.invalidateQueries({ queryKey: ['companies', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['company', data.id] });
    },
  });

  if (!company) {
    return (<MainLayout title="Cargando..." />);
  }

  const companySchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    rfc: Yup.string().required('El rfc es obligatorio'),
    telefono: Yup.string().required('El teléfono es obligatorio'),
    correo: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
    icon: Yup.string().required('El icono de la empresa es obligatorio'),
    password: Yup.string().when([], {
      is: () => isCreating,
      then: schema => schema.required('La contraseña es obligatoria').min(8, 'Mínimo 8 caracteres'),
      otherwise: schema => schema.notRequired(),
    }),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
  });

    return (
      <Formik <FormCompany>
        enableReinitialize
        initialValues={company || emptyCompany}
        validationSchema={companySchema}
        onSubmit={(values) => {
          const { confirmPassword, password, ...rest } = values;

          const finalData: Empresa = {
            ...rest,
            ...(password ? { password } : {}),
            id: companyIdRef.current,
          };

          mutation.mutate(finalData);
        }}
      >
        {
          ({ handleChange, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => (
            <MainLayout
              title={ values.nombre }
              subTitle={ `Empresa: ${values.nombre}` }
              rightAction={() => {
                Alert.alert(
                  'Selecciona una opción',
                  '¿Qué deseas hacer?',
                  [
                    {
                      text: 'Tomar foto',
                      onPress: async () => {
                        const img = await CameraAdapter.takePicture();
                        setFieldValue('icon', img);
                      },
                    },
                    {
                      text: 'Elegir de galería',
                      onPress: async () => {
                        const img = await CameraAdapter.getPicturesFromLibrary();
                        setFieldValue('icon', img);
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
                    <CompanyImage image={values.icon} />
                  </Layout>

                  {/* Formulario */}
                  <Layout style={{ marginHorizontal: 10 }}>
                    <Input
                      label="Nombre"
                      value={ values.nombre }
                      accessoryLeft={ <MyIcon name="briefcase-outline" white /> }
                      onChangeText={handleChange('nombre')}
                      style={styles.input}
                      status={touched.nombre && errors.nombre ? 'danger' : 'basic'}
                      caption={touched.nombre && errors.nombre ? errors.nombre : ''}
                    />
                    <Input
                      label="RFC"
                      value={ values.rfc }
                      accessoryLeft={ <MyIcon name="briefcase-outline" white /> }
                      onChangeText={handleChange('rfc')}
                      style={styles.input}
                      status={touched.rfc && errors.rfc ? 'danger' : 'basic'}
                      caption={touched.rfc && errors.rfc ? errors.rfc : ''}
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
                    <Input
                      label="Colors"
                      value={ values.colors }
                      accessoryLeft={ <MyIcon name="color-palette-outline" white /> }
                      onChangeText={handleChange('colors')}
                      style={styles.input}
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
                <FAB
                  iconName="save-outline"
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
                        queryClient.invalidateQueries({ queryKey: ['empresas'] }); // o el queryKey correspondiente
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