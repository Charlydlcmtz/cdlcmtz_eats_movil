import { Layout, List } from "@ui-kitten/components";

import { useState } from "react";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { Company } from "../../../domain/entities/company";
import { CompanyCard } from "./CompanyCard";

interface Props {
    companies: Company[];
    //todo: fetch nextPage
    fetchNextPage: () => void;
}

export const CompanyList = ({ companies, fetchNextPage }: Props) => {

    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onPullToRefresh = async() => {
        setIsRefreshing(true);
        queryClient.invalidateQueries({ queryKey: ['companies', 'infinite'] });
        setIsRefreshing(false);
    };

    return (
        <List
            data={ companies }
            numColumns={2}
            keyExtractor={ (item, index) => `${item.id}-${index}`}
            renderItem={ ({item}) => <CompanyCard company={item} />}
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