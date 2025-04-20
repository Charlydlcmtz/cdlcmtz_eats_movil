import { Icon, Layout, Text } from "@ui-kitten/components";
import { User } from "../../../domain/entities/user";
import { FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useState } from "react";


interface Props {
  users: User[];
  onRefresh?: () => void;
}

export const UserTableList = ({ users, onRefresh }: Props) => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const [isRefreshing, setIsRefreshing] = useState(false);

    const onPullToRefresh = async () => {
      if (!onRefresh) return;

      setIsRefreshing(true);
      await onRefresh(); // 👈 usamos el refetch pasado desde el padre
      setIsRefreshing(false);
    };

  const renderItem = ({ item }: { item: User }) => (
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
        source={{ uri: item.img_user }}
        style={{ width: 60, height: 60, borderRadius: 30, marginRight: 10 }}
      />

      {/* Info del platillo */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.username]} numberOfLines={1}>
          {item.username}
        </Text>
        <Text style={[styles.nombre]} numberOfLines={2}>
          Nombre: {item.nombre} {item.apellido_p} {item.apellido_m}
        </Text>
        <Text style={[styles.nombre]} numberOfLines={2}>
          Correo: {item.correo}
        </Text>
        <Text style={styles.estatus}>
          <Text
            style={{
              color: item.estatus === 1 ? "#4CAF50" : "#F44336",
              fontWeight: "bold",
            }}
          >
            Estatus: {item.estatus === 1 ? "Activo" : "Desactivado"}
          </Text>
        </Text>
      </View>

      {/* Botón editar */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("UserScreen", { userId: item.id })
        }
        style={{ padding: 5 }}
      >
        <Icon name="edit-2-outline" fill="#3366FF" style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
    </Layout>
  );

  return (
    <FlatList
        data={users}
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
  username: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nombre: {
    color: '#444',
    fontSize: 13,
  },
  estatus: {
    marginTop: 4,
    color: 'black',
    fontSize: 14,
  },
});