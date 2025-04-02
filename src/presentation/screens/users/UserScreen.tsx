import { useTheme } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { RootStackParams } from '../../navigation/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { MainLayout } from '../../layouts/MainLayout';
import { Formik } from 'formik';
import { CameraAdapter } from '../../../config/adapters/camera-adapter';
import { ScrollView } from 'react-native';
import { Button, IndexPath, Input, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import { MyIcon } from '../../components/ui/MyIcon';
import { UserImage } from '../../components/users/UserImage';
import { User } from '../../../domain/entities/user';
import { getUserById, updateCreateUser } from '../../../actions/usuarios';
import * as Yup from 'yup';
import { getCompanys } from '../../../actions/empresas/get-empresas-by-role';

interface Props extends StackScreenProps<RootStackParams, 'UserScreen'>{}

const emptyUser: User & { password?: string; confirmPassword?: string; id_empresa?: string } = {
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
  estatus: true,
};


const userSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  username: Yup.string().required('El username es obligatorio'),
  apellido_p: Yup.string().required('El apellido paterno es obligatorio'),
  apellido_m: Yup.string().required('El apellido materno es obligatorio'),
  telefono: Yup.string().required('El teléfono es obligatorio'),
  no_empleado: Yup.string().required('El número de empleado es obligatorio'),
  correo: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
  id_empresa: Yup.string().required('La empresa es obligatoria'),
});

export const UserScreen = ({ route }: Props) => {
  const userIdRef = useRef(route.params.userId);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));

  const isCreating = userIdRef.current === 'new';

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

    return (
      <Formik
        enableReinitialize
        initialValues={user || emptyUser}
        validationSchema={userSchema}
        onSubmit={ mutation.mutate }
      >
        {
          ({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
            <MainLayout
              title={ values.nombre }
              subTitle={ `Usuario: ${values.username}` }
              rightAction={ async() => {
                const photos = await CameraAdapter.getPicturesFromLibrary();
                setFieldValue('img_user', photos);
              }}
              rightActionIcon="camera-outline"
            >

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
                    style={{ marginVertical: 5 }}
                    status={touched.nombre && errors.nombre ? 'danger' : 'basic'}
                    caption={touched.nombre && errors.nombre ? errors.nombre : ''}
                  />
                  <Input
                    label="Username"
                    value={ values.username }
                    accessoryLeft={ <MyIcon name="person-outline" white /> }
                    onChangeText={handleChange('username')}
                    style={{ marginVertical: 5 }}
                    status={touched.username && errors.username ? 'danger' : 'basic'}
                    caption={touched.username && errors.username ? errors.username : ''}
                  />
                  <Input
                    label="Apellido Paterno"
                    value={ values.apellido_p }
                    accessoryLeft={ <MyIcon name="person-outline" white /> }
                    onChangeText={handleChange('apellido_p')}
                    style={{ marginVertical: 5 }}
                    status={touched.apellido_p && errors.apellido_p ? 'danger' : 'basic'}
                    caption={touched.apellido_p && errors.apellido_p ? errors.apellido_p : ''}
                  />
                  <Input
                    label="Apellido Materno"
                    value={ values.apellido_m }
                    accessoryLeft={ <MyIcon name="person-outline" white /> }
                    onChangeText={handleChange('apellido_m')}
                    style={{ marginVertical: 5 }}
                    status={touched.apellido_m && errors.apellido_m ? 'danger' : 'basic'}
                    caption={touched.apellido_m && errors.apellido_m ? errors.apellido_m : ''}
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
                    label="Numero Empleado"
                    value={ values.no_empleado }
                    keyboardType="number-pad"
                    accessoryLeft={ <MyIcon name="briefcase-outline" white /> }
                    onChangeText={handleChange('no_empleado')}
                    style={{ marginVertical: 5 }}
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
                    style={{ marginVertical: 5 }}
                    status={touched.correo && errors.correo ? 'danger' : 'basic'}
                    caption={touched.correo && errors.correo ? errors.correo : ''}
                  />
                </Layout>

                <Layout style={{ marginVertical: 5 }}>
                  <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Empresa</Text>

                  <Select
                    placeholder="Seleccionar empresa"
                    disabled={loadingEmpresas}
                    selectedIndex={
                      empresas.findIndex((e) => e.id === values.id_empresa) >= 0
                        ? new IndexPath(empresas.findIndex((e) => e.id === values.id_empresa))
                        : undefined
                    }
                    value={
                      empresas.find((e) => e.id === values.id_empresa)?.nombre || 'Seleccionar empresa'
                    }
                    onSelect={(index) => {
                      if (Array.isArray(index)) return; // solo permitimos selección simple
                    
                      const selectedEmpresa = empresas[index.row];
                      setFieldValue('id_empresa', selectedEmpresa.id);
                    }}
                  >
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id} title={empresa.nombre} />
                    ))}
                  </Select>

                  {touched.id_empresa && errors.id_empresa && (
                    <Text style={{ color: 'red', marginTop: 5 }}>{errors.id_empresa}</Text>
                  )}
                </Layout>

                {mutation.isError && (
                  <Text style={{ color: 'red', marginHorizontal: 10 }}>
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : 'Ocurrió un error inesperado'}
                  </Text>
                )}

                {/* Boton de guardar */}
                <Button
                  accessoryLeft={ <MyIcon name="save-outline" white /> }
                  onPress={ () => handleSubmit()}
                  disabled={mutation.isPending}
                  style={{margin: 15 }}
                >
                  Guardar
                </Button>

                <Layout style={{ height: 200 }}  />
              </ScrollView>
            </MainLayout>
          )
        }
      </Formik>
  );
}

