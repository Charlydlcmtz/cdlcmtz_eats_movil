import { Alert, ScrollView } from "react-native";
import { useCart } from "../../context/CartContext";
import { MainLayout } from "../../layouts/MainLayout";
import { Button, Divider, Layout, Text } from "@ui-kitten/components";
import { FoodImage } from "../../components/foods/FoodImage";
import { useState } from "react";
import { createOrder } from "../../../actions/orders/create-order";
import { MyIcon } from "../../components/ui/MyIcon";


export const CartScreen = () => {
    const { cart, clearCart, removeFromCart  } = useCart();

    const [loading, setLoading] = useState(false);

    const total = cart.reduce((acc, item) => {
        return acc + (item.comida.costo * item.cantidad);
    }, 0) ?? 0;

    const handleConfirmarPedido = async () => {
      try {
        setLoading(true);

        await createOrder(
          cart,
          "Comentario global opcional del pedido",
          "1234567812345678", // puedes meter un input real si quieres
          "123",
        );

        Alert.alert("Éxito", "¡Tu pedido ha sido enviado!");
        clearCart();

      } catch (error: any) {
        Alert.alert("Error", error.message || "No se pudo enviar el pedido");
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout title="Tu Carrito">
      <ScrollView style={{ padding: 10 }}>
        {
          !cart || cart.length === 0 ? (
            <Text category="s1" style={{ textAlign: 'center', marginTop: 20 }}>
              Aún no has agregado nada al carrito.
            </Text>
          ) : (
            cart.map((item, idx) => (
              <Layout key={idx} style={{ marginBottom: 15, padding: 10, borderRadius: 10, borderWidth: 1 }}>
                <FoodImage image={item.comida.img_comida} style={{ width: '100%', height: 150, borderRadius: 10 }} />
                <Text category="h6" style={{ marginTop: 10 }}>{item.comida.platillo}</Text>
                <Text appearance="hint">Cantidad: {item.cantidad}</Text>
                <Text appearance="hint">Comentario: {item.comentario || 'Sin comentario'}</Text>
                <Text appearance="hint">Subtotal: ${item.cantidad * item.comida.costo}</Text>
                <Button
                  onPress={() => removeFromCart(item.comida.id)}
                  status="danger"
                  accessoryLeft={<MyIcon name="trash-2-outline" white />}
                  style={{ marginTop: 10 }}
                  size="small"
                >
                  Eliminar
                </Button>
              </Layout>
            ))
          )
        }

        <Divider style={{ marginVertical: 20 }} />

        {
          !!cart && cart.length > 0 && (
            <>
              <Text category="h5">Total: ${total.toFixed(2)}</Text>
              <Button
                style={{ marginTop: 10 }}
                onPress={handleConfirmarPedido}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Confirmar Pedido"}
              </Button>
            </>
          )
        }

        {/* Espacio extra al final */}
        <Layout style={{ height: 150 }}  />
      </ScrollView>
    </MainLayout>
  );
};