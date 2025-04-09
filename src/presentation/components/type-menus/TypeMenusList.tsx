import { Layout, List } from "@ui-kitten/components";
import { useState } from "react";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { TypeMenu } from "../../../domain/entities/type-menu";
import { TypeMenuCard } from "./TypeMenuCard";

interface Props {
    typeMenus: TypeMenu[];
    //todo: fetch nextPage
    fetchNextPage: () => void;
}

export const TypeMenuList = ({ typeMenus, fetchNextPage }: Props) => {

    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onPullToRefresh = async() => {
        setIsRefreshing(true);
        queryClient.invalidateQueries({ queryKey: ['typeMenus', 'infinite'] });
        setIsRefreshing(false);
    };

    return (
        <List
            data={ typeMenus }
            numColumns={2}
            keyExtractor={ (item, index) => `${item.id}-${index}`}
            renderItem={ ({item}) => <TypeMenuCard typeMenu={item} />}
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