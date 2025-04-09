import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../../navigation/StackNavigator"
import { useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFoodById } from "../../../actions/comida";
import { Food } from "../../../domain/entities/food";
import { MainLayout } from "../../layouts/MainLayout";
import { Formik } from "formik";
import { ScrollView } from "react-native";
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { FoodImage } from "../../components/foods/FoodImage";
import { MyIcon } from "../../components/ui/MyIcon";
import { useCart } from "../../context/CartContext";

interface Props extends StackScreenProps<RootStackParams, 'FoodDetailScreen'>{}

export const FoodDetailScreen = ({ route }: Props) => {

    const menuIdRef = useRef(route.params.menuId);
    const theme = useTheme();
    const queryClient = useQueryClient();
    // dentro del componente
    const { addToCart } = useCart();

    const { data: menu } = useQuery({
        queryKey: ['menu', menuIdRef.current],
        queryFn: () => getFoodById(menuIdRef.current),
    });

    const mutation = useMutation({
        onSuccess(data: Food) {
        const id = data?.id ?? menuIdRef.current;
        menuIdRef.current = id;
        queryClient.invalidateQueries({ queryKey: ['menus', 'infinite'] });
        queryClient.invalidateQueries({ queryKey: ['menu', data.id] });
        },
    });

    const [cantidad, setCantidad] = useState("1");
    const [comentario, setComentario] = useState("");

    if (!menu) {
        return <MainLayout title="Cargando..." />;
    }
  return (
    <Formik initialValues={menu} onSubmit={mutation.mutate}>
      {({ handleSubmit, values }) => (
        <MainLayout title={values.platillo} subTitle={`Precio: $${values.costo}`}>
          <ScrollView style={{ flex: 1 }}>
            {/* Imagen centrada */}
            <Layout style={{ marginVertical: 20, alignItems: 'center' }}>
              <FoodImage image={values.img_comida} style={{ width: 250, height: 250, borderRadius: 20 }} />
            </Layout>

            {/* Info del platillo */}
            <Layout style={{ marginHorizontal: 20 }}>
              <Text category="h6" style={{ marginBottom: 5 }}>
                {values.descripcion}
              </Text>

              <Input
                label="Cantidad"
                keyboardType="numeric"
                value={cantidad}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCantidad(numericValue || "1");
                }}
                style={{ marginBottom: 15 }}
              />

              <Input
                label="Comentario (opcional)"
                multiline
                textStyle={{ minHeight: 64 }}
                placeholder="Sin cebolla, extra salsa, etc."
                value={comentario}
                onChangeText={setComentario}
                style={{ marginBottom: 15 }}
              />
            </Layout>

            {/* Botón */}
            <Layout style={{ marginHorizontal: 20 }}>
            <Button
              accessoryLeft={<MyIcon name="shopping-cart-outline" white />}
              onPress={() => {
                addToCart({
                  comida: values,
                  cantidad: parseInt(cantidad), // Usa el valor del input
                  comentario, // Usa el input real del usuario
                });

                // Opcional: Regresar a la pantalla anterior
                // navigation.goBack();
              }}
            >
              Agregar al carrito
            </Button>
            </Layout>

            <Layout style={{ height: 100 }} />
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
}