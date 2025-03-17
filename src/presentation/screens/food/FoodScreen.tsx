import { MainLayout } from "../../layouts/MainLayout";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFoodById } from "../../../actions/comida/get-food-by-id";
import { useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {  ButtonGroup, Button, Input, Layout, useTheme, Text } from "@ui-kitten/components";
import { FadeInImage } from "../../components/ui/FadeInImage";
import { MyIcon } from "../../components/ui/MyIcon";
import { Formik } from "formik";
import { Food } from "../../../domain/entities/food";
import { updateCreateFood } from "../../../actions/comida/update-create-food";
import { Image } from "react-native";


interface Props extends StackScreenProps<RootStackParams, 'FoodScreen'>{}

export const FoodScreen = ({ route }:Props) => {
  const foodIdRef = useRef(route.params.foodId);
  const theme = useTheme();
  const queryClient = useQueryClient();

  // const [cantidad, setCantidad] = useState("1");

  //useQuery
  const { data: food } = useQuery({
    queryKey: ['food', foodIdRef.current ],
    queryFn: () => getFoodById(foodIdRef.current),
  });

  //useMutation
  const mutation = useMutation({
    mutationFn: (data: Food ) => updateCreateFood({... data, id: foodIdRef.current}),
    onSuccess( data: Food){
      foodIdRef.current = data.id; // creación
      queryClient.invalidateQueries({ queryKey: ['foods', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['food', data.id] });
      // queryClient.setQueryData(['food', data.id], data);
    },
  });

  if (!food) {
    return (<MainLayout title="Cargando..." />);
  }

    return (
        <Formik
          initialValues={ food }
          onSubmit={ mutation.mutate }
        >
          {
            ({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
              <MainLayout
                title={ values.platillo }
                subTitle={ `Precio: ${values.costo}` }
              >

                <ScrollView style={{ flex: 1 }}>
                  {/* Imagenes de la comida */}
                  <Layout style= {{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
                    {
                      (values.img_comida.length === 0)
                      ? <Image source={ require('../../../assets/no-product-image.png') } style={{ width: 400, height: 300, marginHorizontal: 4 }} />
                      : (
                          <FadeInImage 
                            uri={values.img_comida}
                            style={{ width: 400, height: 300, marginHorizontal: 4 }}
                          />
                      )
                    }
                  </Layout>

                  {/* Formulario */}
                  <Layout style={{ marginHorizontal: 10 }}>
                    <Input
                      label="Titulo"
                      value={ values.platillo }
                      onChangeText={handleChange('platillo')}
                      style={{ marginVertical: 5 }}
                    />
                    <Input
                      label="Descripción"
                      value={ values.descripcion }
                      onChangeText={handleChange('descripcion')}
                      multiline
                      numberOfLines={5}
                      style={{ marginVertical: 5 }}
                    />
                  </Layout>

                  <Layout style={{ marginVertical: 5, marginHorizontal: 15, flexDirection: 'row', gap: 10 }}>
                    <Input
                      label="Precio"
                      value={ values.costo.toString() }
                      onChangeText={handleChange('costo')}
                      style={{ flex: 1 }}
                    />
                    {/* <Input
                      label="Cantidad"
                      keyboardType="numeric"
                      value={cantidad}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, ""); // Permite solo números
                        setCantidad(numericValue || "1"); // Si se borra, vuelve a "1"
                      }}
                      style={{ flex: 1 }}
                    /> */}
                  </Layout>

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
};
