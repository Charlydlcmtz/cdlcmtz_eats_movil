import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "../../layouts/MainLayout";
import { Input, Layout } from "@ui-kitten/components";
import { FAB } from "../../components/ui/FAB";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { getTypeMenus } from "../../../actions/tipo_menu/get-type-menu-by-role";
import React, { useEffect, useState } from "react";
import { TypeMenuTableList } from "../../components/type-menus/TypeMenuTableList";
import { searchTypeMenuByPage } from "../../../actions/tipo_menu/search-type-menu-page";
import { MyIcon } from "../../components/ui/MyIcon";
import { StyleSheet, useColorScheme } from "react-native";

interface Props {
  height?: number;
}

export const Spacer = ({ height = 10 }: Props) => (
  <Layout style={{ height }} />
);

export const TypeMenusScreen = () => {

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

    const { data: typeMenus = [], isLoading, refetch } = useQuery({
        queryKey: ['typeMenus', debouncedSearch],
        queryFn: () => {
        if (debouncedSearch.trim() === '') {
            return getTypeMenus(); // ⚠️ Usamos la página 0 para traer todos
        } else {
            return searchTypeMenuByPage(debouncedSearch);
        }
        },
    });

  return (
    <>
        <MainLayout
            title='Cdlcmtz - Eats'
            subTitle='Tipos de Menu'
            showMenu
            showGoBack
        >
          <Layout style={{ flex: 1 }} >
            <Input
              placeholder="Buscar Tipo Menu..."
              value={search}
              onChangeText={setSearch}
              accessoryLeft={<MyIcon name="search-outline" white />}
              style={styles.input_search}
            />
            <Spacer height={8} />
            {
              isLoading
              ? (<FullScreenLoader />)
              : <TypeMenuTableList typeMenus={typeMenus} onRefresh={refetch} />
              // <TypeMenuList typeMenus={data?.pages.flat() ?? []} />
            }
          </Layout>
        </MainLayout>

        <FAB
            iconName="folder-add-outline"
            onPress={() => navigation.navigate('TypeMenuScreen', { typeMenuId: 'new' })}
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