import { Text } from "@ui-kitten/components/ui/text/text.component";
import { MainLayout } from "../../layouts/MainLayout";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useQuery } from "@tanstack/react-query";
import { getFoodById } from "../../../actions/comida/get-food-by-id";
import { useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";


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

            

          </ScrollView>

        </MainLayout>
    );
};
