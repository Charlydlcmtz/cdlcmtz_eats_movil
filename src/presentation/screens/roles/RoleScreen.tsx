import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../../navigation/StackNavigator"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Yup from 'yup';
import { MainLayout } from "../../layouts/MainLayout";
import { Formik } from "formik";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { Input, Layout, Text, useTheme } from "@ui-kitten/components";
import { MyIcon } from "../../components/ui/MyIcon";
import { FAB } from "../../components/ui/FAB";
import { useRef, useState } from "react";
import { Role } from "../../../domain/entities/role";
import { getRoleById } from "../../../actions/roles/get-role-by-id";
import { updateCreateRole } from "../../../actions/roles/update-create-role";
import Toast from "react-native-toast-message";
import { CustomSelect } from "../../components/ui/CustomSelect";
import { isAxiosError } from "axios";


interface Props extends StackScreenProps<RootStackParams, 'RoleScreen'>{}

export const RoleScreen = ({ route }: Props) => {
  const roleIdRef = useRef(route.params.roleId);
  const queryClient = useQueryClient();
  const isCreating = roleIdRef.current === 'new';
  const isDarkMode = useColorScheme() === 'dark';
  const styles = createStyles(isDarkMode);
  const [isSaving, setIsSaving] = useState(false);

    //useQuery
  const { data: role } = useQuery({
    queryKey: ['role', roleIdRef.current ],
    queryFn: () => getRoleById(roleIdRef.current),
  });

  //useMutation
  const mutation = useMutation({
    mutationFn: (data: Role ) => updateCreateRole({... data, id: roleIdRef.current}),
    onSuccess( data: Role){
      const id = data?.id ?? roleIdRef.current;
      roleIdRef.current = id; // creación
      queryClient.invalidateQueries({ queryKey: ['roles', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['role', data.id] });
    },
  });

  if (!role) {
    return (<MainLayout title="Cargando..." />);
  }

  const roleSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre del rol es obligatorio'),
    descripcion: Yup.string().required('La descripcion es obligatoria'),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={role}
      validationSchema={roleSchema}
      onSubmit={ mutation.mutate }
    >
      {
        ({ handleChange, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => (
        <MainLayout
          title={ values.nombre }
          subTitle={ `Tipo Menu: ${values.nombre}` }
        >
          {/* View principal que contiene ScrollView + FAB */}
          <View style={{ flex: 1, position: 'relative' }}>
            <ScrollView style={{ flex: 1 }}>
              {/* Imagenes de la comida */}

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
                  multiline={true}
                  label="Descripción"
                  value={ values.descripcion }
                  accessoryLeft={ <MyIcon name="shield-outline" white /> }
                  onChangeText={handleChange('descripcion')}
                  style={styles.input}
                  status={touched.descripcion && errors.descripcion ? 'danger' : 'basic'}
                  caption={touched.descripcion && errors.descripcion ? errors.descripcion : ''}
                />
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
                    queryClient.invalidateQueries({ queryKey: ['roles'] }); // o el queryKey correspondiente
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