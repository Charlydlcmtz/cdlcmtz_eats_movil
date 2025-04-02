import { Layout, List } from "@ui-kitten/components";

import { useState } from "react";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../../../domain/entities/user";
import { UserCard } from "./UserCard";

interface Props {
    users: User[];
    //todo: fetch nextPage
    fetchNextPage: () => void;
}

export const UserList = ({ users, fetchNextPage }: Props) => {

    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onPullToRefresh = async() => {
        setIsRefreshing(true);
        queryClient.invalidateQueries({ queryKey: ['users', 'infinite'] });
        setIsRefreshing(false);
    };

    return (
        <List
            data={ users }
            numColumns={2}
            keyExtractor={ (item, index) => `${item.id}-${index}`}
            renderItem={ ({item}) => <UserCard user={item} />}
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