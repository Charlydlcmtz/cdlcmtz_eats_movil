import { NavigationProp, useNavigation } from "@react-navigation/native"
import { RootStackParams } from "../../navigation/StackNavigator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MainLayout } from "../../layouts/MainLayout";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { FAB } from "../../components/ui/FAB";
import { getCompanys } from "../../../actions/empresas/get-empresas-by-role";
import { CompanyList } from "../../components/companies/CompaniesList";
import { Text } from "@ui-kitten/components";


export const CompaniesScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const { isLoading, isError, data } = useInfiniteQuery({
        queryKey: ['companies', 'infinite'],
        staleTime: 1000 * 60 * 60,
        initialPageParam: 0,

        queryFn: async(params) => {
            const companies = await getCompanys(params.pageParam);
            return companies;
        },

        getNextPageParam: (lastPage, allPages) => allPages.length,
    });

  return (
    <>
        <MainLayout
            title='Cdlcmtz - Eats'
            subTitle='Empresas'
            showMenu
            showGoBack
            >
             {
                isError ? (
                    <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
                    Ocurrió un error al cargar las empresas.
                    </Text>
                ) : isLoading ? (
                    <FullScreenLoader />
                ) : (
                    <CompanyList companies={data?.pages.flat() ?? []} />
                )
            }
            </MainLayout>

            <FAB
            iconName="briefcase-outline"
            onPress={() => navigation.navigate('CompanyScreen', { companyId: 'new' })}
            style={{
                position: 'absolute',
                bottom: 30,
                right: 20,
            }}
        />
    </>
  )
}
