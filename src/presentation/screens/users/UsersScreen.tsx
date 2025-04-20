import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../../layouts/MainLayout';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { FAB } from '../../components/ui/FAB';
import { UserTableList } from '../../components/users/UserTableList';
import { Input, Layout } from '@ui-kitten/components';
import { MyIcon } from '../../components/ui/MyIcon';
import { searchUserByPage } from '../../../actions/usuarios/search-user-page';
import { getUserByPage } from '../../../actions/usuarios';
import { StyleSheet, useColorScheme } from 'react-native';

interface Props {
  height?: number;
}

export const Spacer = ({ height = 10 }: Props) => (
  <Layout style={{ height }} />
);

export const UsersScreen = () => {
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

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users', debouncedSearch],
    queryFn: () => {
      if (debouncedSearch.trim() === '') {
        return getUserByPage(0); // ⚠️ Usamos la página 0 para traer todos
      } else {
        return searchUserByPage(debouncedSearch);
      }
    },
  });


  return (
    <>
      <MainLayout
        title='Cdlcmtz - Eats'
        subTitle='Usuarios'
        showMenu
        showGoBack
      >
        <Layout style={{ flex: 1 }}>
          <Input
            placeholder="Buscar usuario..."
            value={search}
            onChangeText={setSearch}
            accessoryLeft={<MyIcon name="search-outline" white />}
            style={styles.input_search}
          />
          <Spacer height={8} />
          {
            isLoading ? (
              <FullScreenLoader />
            ) : users.length === 0 ? (
              <Layout style={{ padding: 20, alignItems: 'center' }}>
                <MyIcon name="alert-circle-outline" fill="#ccc" style={{ width: 24, height: 24 }} />
                <Spacer height={8} />
                <Input
                  disabled
                  value="No se encontraron usuarios..."
                  style={{ backgroundColor: '#f0f0f0' }}
                />
              </Layout>
            ) : (
              <UserTableList users={users} onRefresh={refetch} />
            )
          }
        </Layout>
      </MainLayout>

      <FAB
        iconName="person-add-outline"
        onPress={() => navigation.navigate('UserScreen', { userId: 'new' })}
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
