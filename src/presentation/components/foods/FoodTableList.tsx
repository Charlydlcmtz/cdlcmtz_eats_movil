import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Menu } from "../../../domain/entities/food";
import { RootStackParams } from "../../navigation/StackNavigator";
import { Icon, Layout, Text } from "@ui-kitten/components";
import { FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { useState } from "react";


interface Props {
  foods: Menu[];
  onRefresh?: () => void;
}

export const FoodTableList = ({ foods, onRefresh }: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onPullToRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh(); // 👈 usamos el refetch pasado desde el padre
    setIsRefreshing(false);
  };

  const renderItem = ({ item }: { item: Menu }) => (
    <Layout
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginBottom: 5,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 2,
      }}
    >
      {/* Imagen */}
      <Image
        source={{ uri: item.img_comida }}
        style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
      />

      {/* Info del platillo */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.titulo]} numberOfLines={1}>
          Platillo: {item.platillo}
        </Text>
        <Text style={[styles.descripcion]} numberOfLines={2}>
          Descripción: {item.descripcion}
        </Text>
        <Text style={styles.precio}>
          Precio: ${Number(item.costo).toFixed(2)} |{" "}
          <Text
            style={{
              color: item.estatus === 1 ? "#4CAF50" : "#F44336",
              fontWeight: "bold",
            }}
          >
            Estatus: {item.estatus === 1 ? "Disponible" : "No disponible"}
          </Text>
        </Text>
      </View>

      {/* Botón editar */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("FoodScreen", { foodId: item.id })
        }
        style={{ padding: 5 }}
      >
        <Icon name="edit-2-outline" fill="#3366FF" style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
    </Layout>
  );

  return (
    <FlatList
      data={foods}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 10 }}
      refreshControl={
          <RefreshControl
              refreshing={ isRefreshing }
              onRefresh={ onPullToRefresh }
          />
      }
    />
  );
};

const styles = StyleSheet.create({
  titulo: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  descripcion: {
    color: '#444',
    fontSize: 13,
  },
  precio: {
    marginTop: 4,
    color: 'black',
    fontSize: 14,
  },
});