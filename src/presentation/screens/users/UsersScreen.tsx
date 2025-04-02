import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MainLayout } from '../../layouts/MainLayout';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { FAB } from '../../components/ui/FAB';
import { UserList } from '../../components/users/UsersList';
import { getUserByPage } from '../../../actions/usuarios/get-user-by-page';

 export const UsersScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { isLoading, data } = useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    staleTime: 1000 * 60 * 60,
    initialPageParam: 0,

    queryFn: async(params) => {
      const users = await getUserByPage(params.pageParam);
      return users;
    },

    getNextPageParam: (lastPage, allPages) => allPages.length,
  });



  return (
    <>
      <MainLayout
        title='Cdlcmtz - Eats'
        subTitle='Usuarios'
        showMenu
        showGoBack
      >
        {
          isLoading
          ? (<FullScreenLoader />)
          : <UserList  users={ data?.pages.flat() ?? [] } />
        }
      </MainLayout>

      <FAB
        iconName="person-add-outline"
        onPress={() => navigation.navigate('UserScreen', { userId: 'new' })}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
        }}
      />
    </>
  );
};

