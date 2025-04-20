import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getOders } from "../../../actions/orders/get-orders-by-empresa";
import { MainLayout } from "../../layouts/MainLayout";
import { Layout, Text, useTheme } from "@ui-kitten/components";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { OrderTableList } from "../../components/orders/OrdersTableList";
import { StyleSheet } from "react-native";
import { MyIcon } from "../../components/ui/MyIcon";
import { useAuthStore } from "../../store/auth/useAuthStore";


export const OrdersScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { user } = useAuthStore();
    const theme = useTheme();
    const styles = createStyles(theme); // ✅ generamos estilos con el tema actual

    const { isLoading, isError, data } = useInfiniteQuery({
        queryKey: ["orders", "infinite"],
        staleTime: 1000 * 60 * 60,
        initialPageParam: 0,

        queryFn: async (params) => {
            const orders = await getOders(params.pageParam);
            return orders;
        },

        getNextPageParam: (lastPage, allPages) => allPages.length,
    });

    const totalOrders = data?.pages.flat().length ?? 0;

    const renderContent = () => {
        if (isError) {
            return (
                <Layout style={styles.centeredContainer}>
                    <MyIcon name="alert-triangle-outline" fill="red" style={styles.icon} />
                    <Text style={styles.errorText}>
                        Ocurrió un error al cargar las órdenes.
                    </Text>
                </Layout>
            );
        }

        if (isLoading) return <FullScreenLoader />;

        if (totalOrders === 0) {
            return (
                <Layout style={styles.centeredContainer}>
                    <MyIcon name="file-text-outline" fill="#ccc" style={styles.icon} />
                    <Text appearance="hint">No hay órdenes registradas aún.</Text>
                </Layout>
            );
        }

        return <OrderTableList orders={data?.pages.flat() ?? []} />;
    };

  return (
    <MainLayout
      title="Órdenes"
      showMenu
      showGoBack
    >
        <Text
            style={[styles.subtitulo]}
        >
            {`Bienvenido ${user?.nombre || "Usuario"}, aquí puedes revisar todas las órdenes realizadas 🧾`}
        </Text>
      {renderContent()}
    </MainLayout>
  );
};

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    centeredContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 50,
    },
    subtitulo: {
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize: 16,
        color: theme['text-basic-color'], // 🟢 Se adapta al modo claro/oscuro
    },
    errorText: {
      color: "red",
      marginTop: 10,
      fontSize: 14,
      textAlign: "center",
    },
    icon: {
      width: 48,
      height: 48,
      marginBottom: 10,
    },
});
