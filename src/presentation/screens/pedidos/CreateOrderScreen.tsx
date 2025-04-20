import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/StackNavigator";
import { MainLayout } from "../../layouts/MainLayout";
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Layout, Text } from "@ui-kitten/components";
import { Menu } from "../../../domain/entities/food";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { getAvailableMenus } from "../../../actions/orders/get-available-menus";
import { FoodImage } from "../../components/foods/FoodImage";
import { FAB } from "../../components/ui/FAB";
import { EmptyMessage } from "../../components/ui/EmptyMessage";

interface Props extends StackScreenProps<RootStackParams, 'CreateOrderScreen'> {}


export const CreateOrderScreen = ({ navigation }: Props) => {
  const { user } = useAuthStore();
  const isDarkMode = useColorScheme() === 'dark';
  const styles = createStyles(isDarkMode);

  const { data: menus = [], isLoading } = useQuery({
    queryKey: ['menus', 'available'],
    queryFn: getAvailableMenus,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buen día!";
    if (hour < 18) return "¡Buena tarde!";
    return "¡Buena noche!";
  };

  return (
    <MainLayout
      title="Levantar Pedido"
      showMenu
      showGoBack
    >
      <Text
        style={[styles.subtitulo]}
      >
        {`${getGreeting()} ${user?.nombre || ''}, elige tu comida favorita 🍽️`}
      </Text>
      <View style={{ flex: 1, padding: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            isLoading ? (
              <Text style={{ textAlign: 'center', marginTop: 40 }}>
                Cargando menús disponibles...
              </Text>
            ) : menus.length === 0 ? (
              <EmptyMessage
                message="No hay platillos disponibles por ahora 🍽️"
                image={require('../../../assets/no-product-image.png')}
              />
            ) : (
              menus.map((menu: Menu) => (
                <TouchableOpacity
                  key={menu.id}
                  onPress={() => navigation.navigate('FoodDetailScreen', { menuId: menu.id })}
                >
                  <Layout
                    style={[styles.card_food]}
                  >
                    <FoodImage
                      image={menu.img_comida}
                    />
                    <View style={{ marginTop: 10 }}>
                      <Text category="h6" style={[ styles.platillo ]}>
                        Platillo: {menu.platillo}
                      </Text>
                      <Text appearance="hint" style={[styles.descripcion]}>
                        Descripción: {menu.descripcion}
                      </Text>
                      <Text style={[styles.precio]}>
                        Precio: ${Number(menu.costo).toFixed(2)}
                      </Text>
                    </View>
                  </Layout>
                </TouchableOpacity>
              ))
            )
          }

          <Layout style={{ height: 140 }} />
        </ScrollView>

        <FAB
          iconName="shopping-bag-outline"
          onPress={() => navigation.navigate('CartScreen')}
          style={styles.fab_boton}
        />
      </View>
    </MainLayout>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    subtitulo: {
      paddingHorizontal: 10,
      marginBottom: 10,
      fontSize: 18,
    },
    card_food: {
      marginBottom: 15,
      padding: 10,
      borderRadius: 12,
      backgroundColor: isDarkMode ? '#024766' : '#7B1FA2',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 4,
    },
    food_image: {
      width: '100%',
      height: 180,
      borderRadius: 10,
    },
    platillo: {
    },
    descripcion: {
      fontSize: 13,
      marginTop: 4,
    },
    precio: {
      marginTop: 5,
      backgroundColor: '#E2E3E5',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      fontSize: 12,
      color: '#333',
    },
    fab_boton: {
      backgroundColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
      position: 'absolute',
      bottom: 100,
      right: 20,
    },
});