import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { MainLayout } from "../../layouts/MainLayout";
import { Input, Layout, Text } from "@ui-kitten/components";
import { FAB } from "../../components/ui/FAB";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { getRoles } from "../../../actions/roles/get-roles-by-role";
import React, { useEffect, useState } from "react";
import { RoleTableList } from "../../components/role/RoleTableList";
import { searchRoleByPage } from "../../../actions/roles/search-role-page";
import { MyIcon } from "../../components/ui/MyIcon";
import { StyleSheet, useColorScheme } from "react-native";

interface Props {
  height?: number;
}

export const Spacer = ({ height = 10 }: Props) => (
  <Layout style={{ height }} />
);

export const RolesScreen = () => {

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

    const { data: roles = [], isLoading, refetch } = useQuery({
        queryKey: ['roles', debouncedSearch],
        queryFn: () => {
        if (debouncedSearch.trim() === '') {
            return getRoles(); // ⚠️ Usamos la página 0 para traer todos
        } else {
            return searchRoleByPage(debouncedSearch);
        }
        },
    });

    const renderContent = () => {
      if (isLoading) return <FullScreenLoader />;

      return  <RoleTableList roles={roles} onRefresh={refetch} />;
      // <RolesList roles={data?.pages.flat() ?? []} />;
    };

  return (
    <>
        <MainLayout
          title='Cdlcmtz - Eats'
          subTitle='Roles'
          showMenu
          showGoBack
        >
          <Layout style={{ flex: 1 }} >
            <Input
              placeholder="Buscar Rol..."
              value={search}
              onChangeText={setSearch}
              accessoryLeft={<MyIcon name="search-outline" white />}
              style={styles.input_search}
            />
            <Spacer height={8} />
            {renderContent()}
          </Layout>
        </MainLayout>

            <FAB
              iconName="folder-add-outline"
              onPress={() => navigation.navigate('RoleScreen', { roleId: 'new' })}
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