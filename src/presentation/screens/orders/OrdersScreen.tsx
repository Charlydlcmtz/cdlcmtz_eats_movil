import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getOders } from "../../../actions/orders/get-orders-by-empresa";
import { MainLayout } from "../../layouts/MainLayout";
import { Text } from "@ui-kitten/components";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { OrdersList } from "../../components/orders/OrdersList";


export const OrdersScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const { isLoading, isError, data } = useInfiniteQuery({
        queryKey: ['orders', 'infinite'],
        staleTime: 1000 * 60 * 60,
        initialPageParam: 0,

        queryFn: async(params) => {
            const orders = await getOders(params.pageParam);
            return orders;
        },

        getNextPageParam: (lastPage, allPages) => allPages.length,
    });

  return (
    <>
        <MainLayout
            title='Cdlcmtz - Eats'
            subTitle='Ordenes'
            showMenu
            showGoBack
            >
                {
                isError ? (
                    <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
                        Ocurrió un error al cargar las ordenes.
                    </Text>
                ) : isLoading ? (
                    <FullScreenLoader />
                ) : (
                    <OrdersList orders={data?.pages.flat() ?? []} />
                )
            }
        </MainLayout>
    </>
  )
} 
