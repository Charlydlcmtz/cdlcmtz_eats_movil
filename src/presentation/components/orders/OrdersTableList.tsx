import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Order } from "../../../domain/entities/order";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Icon, Layout, Text } from "@ui-kitten/components";
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  orders: Order[];
}

export const OrderTableList = ({ orders }: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['orders', 'infinite'] });
    setIsRefreshing(false);
  };

  const renderItem = ({ item }: { item: Order }) => (
    <Layout style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.titulo}>👤 Usuario: {item.usuario.username}</Text>
        <Text style={styles.descripcion}>📧 Correo: {item.usuario.correo}</Text>

        {/* Comentario Global */}
        <Text style={styles.subtitulo}>🍽️ Comentario:</Text>
        {item.descripcion && (
          <Text style={styles.comentario}>
            📝{item.descripcion}
          </Text>
        )}

        <Text style={styles.subtitulo}>🍽️ Platillos:</Text>
        {item.food.map((plato, index) => (
          <Text key={plato.id} style={styles.platillo}>
            • {plato.platillo} x{plato.pivot?.cantidad || 1} – ${Number(plato.costo).toFixed(2)}
          </Text>
        ))}

        <Text style={styles.estatus}>
          📝 Estatus:{" "}
          <Text
            style={{
              fontWeight: "bold",
              color: item.estatus.nombre.includes("Cancelado")
                ? "#F44336"
                : "#4CAF50",
            }}
          >
            {item.estatus.nombre}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("OrderScreen", { orderId: item.id })}
        style={{ padding: 5 }}
      >
        <Icon name="edit-2-outline" fill="#3366FF" style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
    </Layout>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 10 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onPullToRefresh}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  descripcion: {
    color: "#444",
    fontSize: 13,
    marginBottom: 4,
  },
  subtitulo: {
    fontWeight: "bold",
    marginTop: 6,
    color: "#222",
    fontSize: 14,
  },
  platillo: {
    fontSize: 13,
    color: "#333",
    marginLeft: 8,
  },
  comentario: {
    marginTop: 4,
    color: "#555",
    fontSize: 13,
  },
  estatus: {
    marginTop: 6,
    fontSize: 13,
    color: "#000",
  },
});