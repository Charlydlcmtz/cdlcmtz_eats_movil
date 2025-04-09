import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/StackNavigator";
import { MainLayout } from "../../layouts/MainLayout";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout, Text } from "@ui-kitten/components";
import { Food } from "../../../domain/entities/food";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { getAvailableMenus } from "../../../actions/orders/get-available-menus";
import { createOrder } from "../../../actions/orders/create-order";
import { FoodImage } from "../../components/foods/FoodImage";
import { FAB } from "../../components/ui/FAB";

interface Props extends StackScreenProps<RootStackParams, 'CreateOrderScreen'> {}

export const CreateOrderScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore(); // Usuario logueado

  const { data: menus = [], isLoading } = useQuery({
    queryKey: ['menus', 'available'],
    queryFn: getAvailableMenus,
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'infinite'] });
      navigation.goBack();
    },
  });

  return (
    <MainLayout title="Levantar Pedido">
      <View style={{ flex: 1, padding: 10 }}>
        <ScrollView>
          {
            isLoading
              ? <Text>Cargando menús disponibles...</Text>
              : menus.map((menu: Food) => (
                  <TouchableOpacity onPress={ () => navigation.navigate('FoodDetailScreen', { menuId: menu.id})}>
                    <Layout key={menu.id} style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 10 }}>
                      <Layout style= {{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text category="h6">{menu.platillo}</Text>
                      </Layout>
                      <Layout style= {{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <FoodImage image={menu.img_comida} />
                      </Layout>
                      <Text appearance="hint">Descripción: {menu.descripcion}</Text>
                    </Layout>
                  </TouchableOpacity>
              ))
          }

          {mutation.isError && (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
              Ocurrió un error al enviar el pedido.
            </Text>
          )}
        </ScrollView>
        {/* FAB flotante fuera del scroll */}
        <FAB
          iconName="shopping-bag-outline"
          onPress={() => navigation.navigate('CartScreen')}
          style={{
            position: 'absolute',
            bottom: 200, // 👈 cambia de 30 a 100
            right: 15,
          }}
        />
      </View>
    </MainLayout>
  );
};