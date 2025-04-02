import { getFoodByPage } from '../../../actions/comida/get-food-by-page';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MainLayout } from '../../layouts/MainLayout';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { FoodList } from '../../components/foods/FoodList';
import { FAB } from '../../components/ui/FAB';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';


export const HomeScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  // const { isLoading, data: foods = [] } = useQuery({
  //   queryKey: ['foods', 'infinite'],
  //   staleTime: 1000 * 60 * 60, // 1 hour
  //   queryFn: () => getFoodByPage(0),
  // });

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
          : <FoodList  foods={ data?.pages.flat() ?? [] } />
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
