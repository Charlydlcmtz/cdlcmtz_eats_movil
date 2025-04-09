import { Layout, List } from "@ui-kitten/components";
import { useState } from "react";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { Role } from "../../../domain/entities/role";
import { RoleCard } from "./RoleCard";

interface Props {
    roles: Role[];
    //todo: fetch nextPage
    fetchNextPage: () => void;
}

export const RolesList = ({ roles, fetchNextPage }: Props) => {

    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onPullToRefresh = async() => {
        setIsRefreshing(true);
        queryClient.invalidateQueries({ queryKey: ['roles', 'infinite'] });
        setIsRefreshing(false);
    };

    return (
        <List
            data={ roles }
            numColumns={2}
            keyExtractor={ (item, index) => `${item.id}-${index}`}
            renderItem={ ({item}) => <RoleCard role={item} />}
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