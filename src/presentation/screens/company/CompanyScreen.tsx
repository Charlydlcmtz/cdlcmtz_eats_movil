import { useTheme } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { RootStackParams } from '../../navigation/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { MainLayout } from '../../layouts/MainLayout';
import { Formik } from 'formik';
import { CameraAdapter } from '../../../config/adapters/camera-adapter';
import { ScrollView, View } from 'react-native';
import { Input, Layout, Text } from '@ui-kitten/components';
import { MyIcon } from '../../components/ui/MyIcon';
import * as Yup from 'yup';
import { FAB } from '../../components/ui/FAB';
import { Company } from '../../../domain/entities/company';
import { getCompanyById } from '../../../actions/empresas/get-company-by-id';
import { updateCreateCompany } from '../../../actions/empresas/update-create-company';
import { CompanyImage } from '../../components/companies/CompanyImage';

interface Props extends StackScreenProps<RootStackParams, 'CompanyScreen'>{}

// 👇 Aquí lo defines
type FormCompany = Company & {
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
  const theme = useTheme();
  const queryClient = useQueryClient();
  const isCreating = companyIdRef.current === 'new';

  //useQuery
  const { data: company } = useQuery({
    queryKey: ['company', companyIdRef.current ],
    queryFn: () => getCompanyById(companyIdRef.current),
  });

  //useMutation
  const mutation = useMutation({
    mutationFn: (data: Company ) => updateCreateCompany({... data, id: companyIdRef.current}),
    onSuccess( data: Company){
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
    colors: Yup.string().required('Los colores de la empresa son obligatorios'),
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

          const finalData: Company = {
            ...rest,
            ...(password ? { password } : {}),
            id: companyIdRef.current,
          };

          mutation.mutate(finalData);
        }}
      >
        {
          ({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
            <MainLayout
              title={ values.nombre }
              subTitle={ `Empresa: ${values.nombre}` }
              rightAction={ async() => {
                const photos = await CameraAdapter.getPicturesFromLibrary();
                setFieldValue('icon', photos);
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
                      style={{ marginVertical: 5 }}
                      status={touched.nombre && errors.nombre ? 'danger' : 'basic'}
                      caption={touched.nombre && errors.nombre ? errors.nombre : ''}
                    />
                    <Input
                      label="RFC"
                      value={ values.rfc }
                      accessoryLeft={ <MyIcon name="briefcase-outline" white /> }
                      onChangeText={handleChange('rfc')}
                      style={{ marginVertical: 5 }}
                      status={touched.rfc && errors.rfc ? 'danger' : 'basic'}
                      caption={touched.rfc && errors.rfc ? errors.rfc : ''}
                    />
                    <Input
                      label="Teléfono"
                      keyboardType="phone-pad"
                      value={ values.telefono }
                      accessoryLeft={ <MyIcon name="phone-outline" white /> }
                      onChangeText={handleChange('telefono')}
                      style={{ marginVertical: 5 }}
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
                      style={{ marginVertical: 5 }}
                      status={touched.correo && errors.correo ? 'danger' : 'basic'}
                      caption={touched.correo && errors.correo ? errors.correo : ''}
                    />
                    <Input
                      label="Colors"
                      value={ values.colors }
                      accessoryLeft={ <MyIcon name="color-palette-outline" white /> }
                      onChangeText={handleChange('colors')}
                      style={{ marginVertical: 5 }}
                      status={touched.colors && errors.colors ? 'danger' : 'basic'}
                      caption={touched.colors && errors.colors ? errors.colors : ''}
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
                        style={{ marginVertical: 5 }}
                        secureTextEntry
                        status={touched.password && errors.password ? 'danger' : 'basic'}
                        caption={touched.password && errors.password ? errors.password : ''}
                      />
                      <Input
                        label="Confirmar contraseña"
                        value={values.confirmPassword}
                        accessoryLeft={<MyIcon name="lock-outline" white />}
                        onChangeText={handleChange('confirmPassword')}
                        style={{ marginVertical: 5 }}
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
                  onPress={() => handleSubmit()}
                  style={{
                    position: 'absolute',
                    bottom: 300, // 👈 cambia de 30 a 100
                    right: 10,
                  }}
                />
              </View>
            </MainLayout>
          )
        }
      </Formik>
  );
}