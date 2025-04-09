import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../../navigation/StackNavigator"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Yup from 'yup';
import { MainLayout } from "../../layouts/MainLayout";
import { Formik } from "formik";
import { ScrollView, View } from "react-native";
import { Input, Layout, Text, useTheme } from "@ui-kitten/components";
import { MyIcon } from "../../components/ui/MyIcon";
import { FAB } from "../../components/ui/FAB";
import { useRef } from "react";
import { Role } from "../../../domain/entities/role";
import { getRoleById } from "../../../actions/roles/get-role-by-id";
import { updateCreateRole } from "../../../actions/roles/update-create-role";


interface Props extends StackScreenProps<RootStackParams, 'RoleScreen'>{}

export const RoleScreen = ({ route }: Props) => {
    const roleIdRef = useRef(route.params.roleId);
    const theme = useTheme();
    const queryClient = useQueryClient();


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
    // id_empresa: Yup.string().required('La empresa es obligatoria'),
    // estatus: Yup.string().required('El estatus es obligatorio'),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={role}
      validationSchema={roleSchema}
      onSubmit={ mutation.mutate }
    >
      {
        ({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
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
                  style={{ marginVertical: 5 }}
                  status={touched.nombre && errors.nombre ? 'danger' : 'basic'}
                  caption={touched.nombre && errors.nombre ? errors.nombre : ''}
                />
                <Input
                  multiline={true}
                  label="Descripción"
                  value={ values.descripcion }
                  accessoryLeft={ <MyIcon name="shield-outline" white /> }
                  onChangeText={handleChange('descripcion')}
                  style={{ marginVertical: 5 }}
                  status={touched.descripcion && errors.descripcion ? 'danger' : 'basic'}
                  caption={touched.descripcion && errors.descripcion ? errors.descripcion : ''}
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
              onPress={ () => handleSubmit()}
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
};

