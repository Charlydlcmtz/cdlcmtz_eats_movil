import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MainLayout } from "../../layouts/MainLayout";
import { Text } from "@ui-kitten/components";
import { FAB } from "../../components/ui/FAB";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { getTypeMenus } from "../../../actions/tipo_menu/get-type-menu-by-role";
import { TypeMenuList } from "../../components/type-menus/TypeMenusList";


export const TypeMenusScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const { isLoading, isError, data } = useInfiniteQuery({
        queryKey: ['typeMenus', 'infinite'],
        staleTime: 1000 * 60 * 60,
        initialPageParam: 0,

        queryFn: async(params) => {
            const typeMenus = await getTypeMenus(params.pageParam);
            return typeMenus;
        },

        getNextPageParam: (lastPage, allPages) => allPages.length,
    });

  return (
    <>
        <MainLayout
            title='Cdlcmtz - Eats'
            subTitle='Tipos de Menu'
            showMenu
            showGoBack
            >
                {
                isError ? (
                    <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
                        Ocurrió un error al cargar los tipos de menu.
                    </Text>
                ) : isLoading ? (
                    <FullScreenLoader />
                ) : (
                    <TypeMenuList typeMenus={data?.pages.flat() ?? []} />
                )
            }
        </MainLayout>

        <FAB
            iconName="folder-add-outline"
            onPress={() => navigation.navigate('TypeMenuScreen', { typeMenuId: 'new' })}
            style={{
                position: 'absolute',
                bottom: 30,
                right: 20,
            }}
        />
    </>
  );
};

