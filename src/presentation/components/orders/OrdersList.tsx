import { Layout, List } from "@ui-kitten/components";
import { useState } from "react";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { OrderCard } from "./OrderCard";
import { Order } from "../../../domain/entities/order";

interface Props {
    orders: Order[];
    //todo: fetch nextPage
    fetchNextPage: () => void;
}

export const OrdersList = ({ orders, fetchNextPage }: Props) => {

    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onPullToRefresh = async() => {
        setIsRefreshing(true);
        queryClient.invalidateQueries({ queryKey: ['orders', 'infinite'] });
        setIsRefreshing(false);
    };

    return (
        <List
            data={ orders }
            numColumns={2}
            keyExtractor={ (item, index) => `${item.id}-${index}`}
            renderItem={ ({item}) => <OrderCard order={item} />}
            ListFooterComponent={ () => <Layout style={{ height: 150 }} /> }
            onEndReached={ fetchNextPage }
            onEndReachedThreshold={0.8}
            refreshControl={
                <RefreshControl
                    refreshing={ isRefreshing }
                    onRefresh={ onPullToRefresh }
                />
            }
        />
    );
}