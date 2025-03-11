import { MainLayout } from "../../layouts/MainLayout";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useQuery } from "@tanstack/react-query";
import { getFoodById } from "../../../actions/comida/get-food-by-id";
import { useRef } from "react";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Input, Layout } from "@ui-kitten/components";
import { FadeInImage } from "../../components/ui/FadeInImage";


interface Props extends StackScreenProps<RootStackParams, 'FoodScreen'>{}

export const FoodScreen = ({ route }:Props) => {
  
  const foodIdRef = useRef(route.params.foodId);
  const { foodId } = route.params;

  //useQuery
  const { data: food } = useQuery({
    queryKey: ['food', foodIdRef.current ],
    queryFn: () => getFoodById(foodIdRef.current ),
  });

  //useMutation
  if (!food) {
    return (<MainLayout title="Cargando..." />);
  }

    return (
        <MainLayout
          title={ food.platillo }
          subTitle={ `Precio: ${food.costo}` }
        >

          <ScrollView style={{ flex: 1 }}>

            {/* Imagenes de la comida */}
            <Layout>
              {food.img_comida && (
                <FadeInImage 
                  uri={food.img_comida}
                  style={{ width: 400, height: 300, marginHorizontal: 4 }}
                />
              )}
            </Layout>

            {/* Formulario */}
            <Layout style={{ marginHorizontal: 10 }}>
              <Input
                label="Titulo"
                value={ food.platillo }
                style={{ marginVertical: 5 }}
              />
              <Input
                label="Descripción"
                value={ food.descripcion }
                multiline
                numberOfLines={5}
                style={{ marginVertical: 5 }}
              />
            </Layout>

            <Layout style={{ marginVertical: 5, marginHorizontal: 15, flexDirection: 'row', gap: 10 }}>
              <Input
                label="Precio"
                value={ food.costo.toString() }
                style={{ flex: 1 }}
              />
              <Input
                label="Cantidad"
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
            </Layout>

            <Layout style={{ height: 200 }}  />
          </ScrollView>

        </MainLayout>
    );
};
