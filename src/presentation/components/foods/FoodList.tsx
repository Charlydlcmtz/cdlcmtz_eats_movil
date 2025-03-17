import { Layout, List } from "@ui-kitten/components";
import { Food } from "../../../domain/entities/food";
import { FoodCard } from "./FoodCard";
import { useState } from "react";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";



interface Props {
    foods: Food[];
    //todo: fetch nextPage
    fetchNextPage: () => void;
}

export const FoodList = ({ foods, fetchNextPage }: Props) => {

    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onPullToRefresh = async() => {
        setIsRefreshing(true);
        queryClient.invalidateQueries({ queryKey: ['foods', 'infinite'] });
        setIsRefreshing(false);
    }

    return (
        <List
            data={ foods }
            numColumns={2}
            keyExtractor={ (item, index) => `${item.id}-${index}`}
            renderItem={ ({item}) => <FoodCard food={item} />}
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
};
