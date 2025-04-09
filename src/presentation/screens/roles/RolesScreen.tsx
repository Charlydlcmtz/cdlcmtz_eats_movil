import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MainLayout } from "../../layouts/MainLayout";
import { Text } from "@ui-kitten/components";
import { FAB } from "../../components/ui/FAB";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { RolesList } from "../../components/role/RolesList";
import { getRoles } from "../../../actions/roles/get-roles-by-role";


export const RolesScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const { isLoading, isError, data } = useInfiniteQuery({
        queryKey: ['roles', 'infinite'],
        staleTime: 1000 * 60 * 60,
        initialPageParam: 0,

        queryFn: async(params) => {
            const roles = await getRoles(params.pageParam);
            return roles;
        },

        getNextPageParam: (lastPage, allPages) => allPages.length,
    });

    const renderContent = () => {
        if (isError) {
          return (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
              Ocurrió un error al cargar los roles.
            </Text>
          );
        }

        if (isLoading) return <FullScreenLoader />;

        return <RolesList roles={data?.pages.flat() ?? []} />;
      };

  return (
    <>
        <MainLayout
            title='Cdlcmtz - Eats'
            subTitle='Roles'
            showMenu
            showGoBack
            >
                {renderContent()}
        </MainLayout>

            <FAB
                iconName="folder-add-outline"
                onPress={() => navigation.navigate('RoleScreen', { roleId: 'new' })}
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 20,
                }}
            />
        </>
  );
};