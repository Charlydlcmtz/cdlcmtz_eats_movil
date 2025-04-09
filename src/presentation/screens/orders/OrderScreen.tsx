import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../../navigation/StackNavigator"
import { useRef } from "react";
import { Input, Layout, Text, useTheme } from "@ui-kitten/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Order } from "../../../domain/entities/order";
import { MainLayout } from "../../layouts/MainLayout";
import * as Yup from 'yup';
import { Formik } from "formik";
import { ScrollView, View } from "react-native";
import { MyIcon } from "../../components/ui/MyIcon";
import { FAB } from "../../components/ui/FAB";
import { getOrderById } from "../../../actions/orders/get-order-by-id";
import { updateOrderG } from "../../../actions/orders/update-order";


interface Props extends StackScreenProps<RootStackParams, 'OrderScreen'>{}

export const OrderScreen = ({ route }: Props) => {

    const orderIdRef = useRef(route.params.orderId);
    const theme = useTheme();
    const queryClient = useQueryClient();

    //useQuery
  const { data: order } = useQuery({
    queryKey: ['order', orderIdRef.current ],
    queryFn: () => getOrderById(orderIdRef.current),
  });

  //useMutation
  const mutation = useMutation({
    mutationFn: (data: Order ) => updateOrderG({... data, id: orderIdRef.current}),
    onSuccess( data: Order){
      const id = data?.id ?? orderIdRef.current;
      orderIdRef.current = id; // creación
      queryClient.invalidateQueries({ queryKey: ['orders', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
    },
  });

  if (!order) {
    return (<MainLayout title="Cargando..." />);
  }

  const orderSchema = Yup.object().shape({
    estatus: Yup.string().required('El estatus es obligatorio'),
  });

  return (
    <Formik
          enableReinitialize
          initialValues={order}
          validationSchema={orderSchema}
          onSubmit={ mutation.mutate }
        >
          {
            ({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
            <MainLayout
              title={ values.usuario.username }
              subTitle={ `Orden de : ${values.usuario.username}` }
            >
              {/* View principal que contiene ScrollView + FAB */}
              <View style={{ flex: 1, position: 'relative' }}>
                <ScrollView style={{ flex: 1 }}>
                  {/* Imagenes de la comida */}

                  {/* Formulario */}
                  <Layout style={{ marginHorizontal: 10 }}>
                    <Input
                      label="Estatus"
                      value={ values.estatus.nombre }
                      accessoryLeft={ <MyIcon name="briefcase-outline" white /> }
                      onChangeText={handleChange('nombre')}
                      style={{ marginVertical: 5 }}
                      status={touched.estatus?.nombre && errors.estatus?.nombre ? 'danger' : 'basic'}
                      caption={touched.estatus?.nombre && errors.estatus?.nombre ? errors.estatus?.nombre : ''}
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
}
