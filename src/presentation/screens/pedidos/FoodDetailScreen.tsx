import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../../navigation/StackNavigator"
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFoodById } from "../../../actions/comida";
import { Menu } from "../../../domain/entities/food";
import { MainLayout } from "../../layouts/MainLayout";
import { Formik } from "formik";
import { ScrollView, StyleSheet, useColorScheme } from "react-native";
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { FoodImage } from "../../components/foods/FoodImage";
import { MyIcon } from "../../components/ui/MyIcon";
import { useCart } from "../../context/CartContext";
import Toast from "react-native-toast-message";

interface Props extends StackScreenProps<RootStackParams, 'FoodDetailScreen'>{}

export const FoodDetailScreen = ({ route }: Props) => {

    const menuIdRef = useRef(route.params.menuId);
    const queryClient = useQueryClient();
    const isDarkMode = useColorScheme() === 'dark';
      const styles = createStyles(isDarkMode); // ✅ generamos estilos con el tema actual
    const [isAdding, setIsAdding] = useState(false);
    const [cantidad, setCantidad] = useState("1");
    const [comentario, setComentario] = useState("");
    // dentro del componente
    const { addToCart } = useCart();

    const { data: menu } = useQuery({
        queryKey: ['menu', menuIdRef.current],
        queryFn: () => getFoodById(menuIdRef.current),
    });

    const mutation = useMutation({
        onSuccess(data: Menu) {
        const id = data?.id ?? menuIdRef.current;
        menuIdRef.current = id;
        queryClient.invalidateQueries({ queryKey: ['menus', 'infinite'] });
        queryClient.invalidateQueries({ queryKey: ['menu', data.id] });
        },
    });

    if (!menu) {
        return <MainLayout title="Cargando..." />;
    }
  return (
    <Formik initialValues={menu} onSubmit={mutation.mutate}>
      {({ handleSubmit, values }) => (
        <MainLayout title={values.platillo} subTitle={`Precio: $${values.costo}`}>
          <ScrollView style={styles.scroll_view}>
            <Layout style={styles.layout_img}>
              <FoodImage image={values.img_comida} />
            </Layout>

            <Layout style={[styles.layout_card]}>
              <Layout style={[styles.info_card]}>
                <Text category="h6" style={[styles.platillo]}>
                  Nombre: {values.platillo}
                </Text>
                <Text style={[styles.descripcion]}>
                  Descripción: {values.descripcion}
                </Text>
                <Text category="s1" style={[styles.text_precio]}>
                  Precio: <Text style={[styles.precio]}>${values.costo}</Text>
                </Text>
              </Layout>

              <Layout style={{ height: 30 }} />

              {/* Cantidad con botones */}
              <Layout style={[styles.layout_botones]}>
                <Button style={styles.botones_cant} size="large" onPress={() => setCantidad(prev => `${Math.max(1, parseInt(prev) - 1)}`)}>-</Button>
                <Input
                  value={cantidad}
                  keyboardType="numeric"
                  style={[styles.botones, styles.input]}
                  onChangeText={(text) => setCantidad(text.replace(/[^0-9]/g, "") || "1")}
                />
                <Button style={styles.botones_cant} size="large"  onPress={() => setCantidad(prev => `${parseInt(prev) + 1}`)}>+</Button>
              </Layout>

              <Input
                label="Comentario"
                placeholder="Sin cebolla, extra salsa, etc."
                value={comentario}
                multiline
                textStyle={{ minHeight: 64 }}
                onChangeText={setComentario}
                style={[styles.comentario, styles.input]}
              />
              <Button
                accessoryLeft={<MyIcon name="shopping-cart-outline" white />}
                onPress={async () => {
                  setIsAdding(true); // Desactiva y cambia texto
                  addToCart({
                    comida: values,
                    cantidad: parseInt(cantidad),
                    comentario,
                  });

                  // Mostramos el toast
                  Toast.show({
                    type: 'success',
                    text1: 'Agregado al carrito 🛒',
                    text2: `${values.platillo} x${cantidad}`,
                  });

                  // Mínimo 700ms de feedback visual
                  setTimeout(() => {
                    setIsAdding(false);
                    setCantidad("1");
                    setComentario('');
                  }, 700);
                }}
                disabled={isAdding}
                style={styles.agregar}
              >
                {isAdding ? 'Agregando...' : 'Agregar al carrito'}
              </Button>
            </Layout>
            <Layout style={{ height: 140 }} />
          </ScrollView>
          <Text style={[styles.texto_despedida]}>
            “Un platillo bien pedido, es media felicidad ganada.” 🍱✨
          </Text>
        </MainLayout>
      )}
    </Formik>
  );
}

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    scroll_view: {
      flex: 1,
      paddingHorizontal: 20,
    },
    layout_img: {
      marginVertical: 20,
      alignItems: 'center',
    },
    layout_card: {
      marginBottom: 15,
    },
    platillo: {
      marginHorizontal: 20,
      fontWeight: 'bold',
      fontSize: 20,
    },
    descripcion: {
      marginHorizontal: 20,
      marginVertical: 8,
      color: isDarkMode ? '#ccc' : '#fff',
    },
    text_precio: {
      marginHorizontal: 20,
      fontSize: 18,
      marginBottom: 15,
    },
    precio: {
      color: '#4CAF50',
      fontWeight: 'bold',
    },
    layout_botones: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    botones: {
      marginHorizontal: 10,
      flex: 1,
    },
    botones_cant: {
      backgroundColor: isDarkMode ? '#024766' : '#7B1FA2',
      borderRadius: 30,
    },
    input: {
      marginVertical: 5,
      backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF20',
      borderColor: isDarkMode ? '#555' : '#FFFFFF55',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    comentario: {
      marginBottom: 20,
    },
    texto_despedida: {
      marginBottom: 20,
      textAlign: 'center',
      marginTop: 30,
      color: '#aaa',
      fontStyle: 'italic',
    },
    agregar:{
      backgroundColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
      borderRadius: 10,
    },
    info_card: {
      backgroundColor: isDarkMode ? '#024766' : '#7B1FA2',
      borderRadius: 10,
    },
});