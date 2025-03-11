import { getFoodByPage } from '../../../actions/comida/get-food-by-page';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MainLayout } from '../../layouts/MainLayout';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { FoodList } from '../../components/foods/FoodList';


export const HomeScreen = () => {

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
      console.log({params});
      const foods = await getFoodByPage(params.pageParam);
      return foods;
    },

    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  return (
    <MainLayout
      title='Cdlcmtz - Eats'
      subTitle='Aplicación Administrativa'
    >
      {
        isLoading 
        ? (<FullScreenLoader />)
        : <FoodList  foods={ data?.pages.flat() ?? [] } />
      }
    </MainLayout>
  );
};
