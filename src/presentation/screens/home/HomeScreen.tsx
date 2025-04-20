import { MainLayout } from '../../layouts/MainLayout';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';

import { FAB } from '../../components/ui/FAB';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { NavigationProp, StackActions, useNavigation } from '@react-navigation/native';
import { FoodTableList } from '../../components/foods/FoodTableList';
import { StyleSheet, useColorScheme } from 'react-native';
import { Input, Layout } from '@ui-kitten/components';
import { MyIcon } from '../../components/ui/MyIcon';
import { searchFoodByPage } from '../../../actions/comida/search-food-page';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useQuery } from '@tanstack/react-query';
import { getFoodByPage } from '../../../actions/comida';

interface Props {
  height?: number;
}

export const Spacer = ({ height = 10 }: Props) => (
  <Layout style={{ height }} />
);

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const styles = createStyles(isDarkMode);

  useEffect(() => {
    if (user?.role.nombre === 'User_Role') {
      navigation.dispatch(StackActions.replace('CreateOrderScreen'));
    }
  }, []);

  // Debounce para búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data: foods = [], isLoading, refetch } = useQuery({
    queryKey: ['foods', debouncedSearch],
    queryFn: () => {
      if (debouncedSearch.trim() === '') {
        return getFoodByPage(0); // ⚠️ Usamos la página 0 para traer todos
      } else {
        return searchFoodByPage(debouncedSearch);
      }
    },
  });

  return (
    <>
      <MainLayout
        title='Cdlcmtz - Eats'
        subTitle='Gestión de Platillos'
        showMenu
      >
        <Layout style={{ flex: 1 }}>
          <Input
            placeholder="Buscar comida..."
            value={search}
            onChangeText={setSearch}
            accessoryLeft={<MyIcon name="search-outline" white />}
            style={[styles.input_search]}
          />
          <Spacer height={8} />
          {isLoading ? (
            <FullScreenLoader />
          ) : (
              <FoodTableList foods={foods} onRefresh={refetch} />
          )}
        </Layout>
      </MainLayout>

      <FAB
        iconName="plus-outline"
        onPress={() => navigation.navigate('FoodScreen', { foodId: 'new' })}
        style={[styles.boton_fab]}
      />
    </>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
  input_search: {
    backgroundColor: '#FFFFFF20',
    borderColor: '#FFFFFF55',
    borderRadius: 8,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  boton_fab: {
    position: 'absolute',
    backgroundColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
    bottom: 30,
    right: 50,
    zIndex: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});