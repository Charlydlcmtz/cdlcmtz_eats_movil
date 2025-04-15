import { getFoodByPage } from '../../../actions/comida/get-food-by-page';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MainLayout } from '../../layouts/MainLayout';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';

import { FAB } from '../../components/ui/FAB';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { StackActions, useNavigation } from '@react-navigation/native';
import { FoodTableList } from '../../components/foods/FoodTableList';


export const HomeScreen = () => {

  const navigation = useNavigation();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role.nombre === 'User_Role') {
      navigation.dispatch(StackActions.replace('CreateOrderScreen'));
    }
  }, []);

  const { isLoading, data } = useInfiniteQuery({
    queryKey: ['foods', 'infinite'],
    staleTime: 1000 * 60 * 60, // 1 hour
    initialPageParam: 0,

    queryFn: async(params) =>{
      const foods = await getFoodByPage(params.pageParam);
      return foods;
    },

    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  return (
    <>
      <MainLayout
        title='Cdlcmtz - Eats'
        subTitle='Aplicación Administrativa'
        showMenu
      >
        {
          isLoading
          ? (<FullScreenLoader />)
          : <FoodTableList foods={ data?.pages.flat() ?? [] } />
          // <FoodList  foods={ data?.pages.flat() ?? [] } />
        }
      </MainLayout>

      <FAB
        iconName="plus-outline"
        onPress={() => navigation.navigate('FoodScreen', { foodId: 'new' })}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
        }}
      />
    </>
  );
};
