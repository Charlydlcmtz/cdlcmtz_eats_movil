import { NavigationProp, useNavigation } from "@react-navigation/native"
import { RootStackParams } from "../../navigation/StackNavigator";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { MainLayout } from "../../layouts/MainLayout";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { FAB } from "../../components/ui/FAB";
import { getCompanys } from "../../../actions/empresas/get-empresas-by-role";
import { Input, Layout, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { CompanyTableList } from "../../components/companies/CompanyTableList";
import { searchCompanyByPage } from "../../../actions/empresas/search-company-page";
import { MyIcon } from "../../components/ui/MyIcon";
import { StyleSheet, useColorScheme } from "react-native";

interface Props {
  height?: number;
}

export const Spacer = ({ height = 10 }: Props) => (
  <Layout style={{ height }} />
);


export const CompaniesScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const isDarkMode = useColorScheme() === 'dark';
    const styles = createStyles(isDarkMode);

    // Debounce para búsqueda
    useEffect(() => {
        const timeout = setTimeout(() => {
        setDebouncedSearch(search.trim());
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    const { data: companies = [], isLoading, refetch } = useQuery({
        queryKey: ['companies', debouncedSearch],
        queryFn: () => {
        if (debouncedSearch.trim() === '') {
            return getCompanys(); // ⚠️ Usamos la página 0 para traer todos
        } else {
            return searchCompanyByPage(debouncedSearch);
        }
        },
    });

  return (
    <>
        <MainLayout
            title='Cdlcmtz - Eats'
            subTitle='Empresas'
            showMenu
            showGoBack
            >
              <Layout style={{ flex: 1 }} >
                <Input
                  placeholder="Buscar Empresa..."
                  value={search}
                  onChangeText={setSearch}
                  accessoryLeft={<MyIcon name="search-outline" white />}
                  style={styles.input_search}
                />
                <Spacer height={8} />
                {
                    isLoading
                    ? (<FullScreenLoader />)
                    : <CompanyTableList companies={companies} onRefresh={refetch} />
                    // <CompanyList  users={ data?.pages.flat() ?? [] } />
                }
              </Layout>
            </MainLayout>

            <FAB
            iconName="briefcase-outline"
            onPress={() => navigation.navigate('CompanyScreen', { companyId: 'new' })}
            style={styles.fab_boton}
        />
    </>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    input_search: {
      backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF20',
      borderColor: isDarkMode ? '#555' : '#FFFFFF55',
      borderRadius: 8,
      marginBottom: 8,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    fab_boton: {
      backgroundColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
      position: 'absolute',
      bottom: 30,
      right: 20,
    },
});