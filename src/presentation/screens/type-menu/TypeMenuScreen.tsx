import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../../navigation/StackNavigator"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Yup from 'yup';
import { MainLayout } from "../../layouts/MainLayout";
import { Formik } from "formik";
import { TypeMenu } from "../../../domain/entities/type-menu";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { IndexPath, Input, Layout, Text } from "@ui-kitten/components";
import { MyIcon } from "../../components/ui/MyIcon";
import { FAB } from "../../components/ui/FAB";
import { useRef, useState } from "react";
import { getTypeMenuById } from "../../../actions/tipo_menu/get-type-menu-by-id";
import { updateCreateTypeMenu } from "../../../actions/tipo_menu/update-create-type-menu";
import { getCompanys } from "../../../actions/empresas/get-empresas-by-role";
import { CustomSelect } from "../../components/ui/CustomSelect";
import Toast from "react-native-toast-message";
import { isAxiosError } from "axios";


interface Props extends StackScreenProps<RootStackParams, 'TypeMenuScreen'>{}

export const TypeMenuScreen = ({ route }: Props) => {
    const typeMenuIdRef = useRef(route.params.typeMenuId);
    const queryClient = useQueryClient();
    const isCreating = typeMenuIdRef.current === 'new';
    const isDarkMode = useColorScheme() === 'dark';
    const styles = createStyles(isDarkMode);
    const [isSaving, setIsSaving] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));

    const { data: empresas = [], isLoading: loadingEmpresas } = useQuery({
      queryKey: ['empresas'],
      queryFn: getCompanys,
    });

    //useQuery
  const { data: typeMenu } = useQuery({
    queryKey: ['typeMenu', typeMenuIdRef.current ],
    queryFn: () => getTypeMenuById(typeMenuIdRef.current),
  });

  //useMutation
  const mutation = useMutation({
    mutationFn: (data: TypeMenu ) => updateCreateTypeMenu({... data, id: typeMenuIdRef.current}),
    onSuccess( data: TypeMenu){
      const id = data?.id ?? typeMenuIdRef.current;
      typeMenuIdRef.current = id; // creación
      queryClient.invalidateQueries({ queryKey: ['typeMenus', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['typeMenu', data.id] });
    },
  });

  if (!typeMenu) {
    return (<MainLayout title="Cargando..." />);
  }

  const typeMenuSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre del menu es obligatorio'),
    descripcion: Yup.string().required('La descripcion es obligatoria'),
    // id_empresa: Yup.string().required('La empresa es obligatoria'),
    // estatus: Yup.string().required('El estatus es obligatorio'),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={typeMenu}
      validationSchema={typeMenuSchema}
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
                  accessoryLeft={ <MyIcon name="briefcase-outline" white /> }
                  onChangeText={handleChange('descripcion')}
                  style={styles.input}
                  status={touched.descripcion && errors.descripcion ? 'danger' : 'basic'}
                  caption={touched.descripcion && errors.descripcion ? errors.descripcion : ''}
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
                    queryClient.invalidateQueries({ queryKey: ['typeMenus'] }); // o el queryKey correspondiente
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