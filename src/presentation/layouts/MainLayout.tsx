import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Divider, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MyIcon } from '../components/ui/MyIcon';

interface Props {
    title: string,
    subTitle?: string,

    rightAction?: () => void;
    rightActionIcon: string;

    children?: React.ReactNode;
    showGoBack?: boolean;  // 👈 para forzar mostrar el botón de regresar
    showMenu?: boolean;    // 👈 para forzar mostrar el botón de menú
}
export const MainLayout = ({ 
    title, 
    subTitle, 
    rightAction, 
    rightActionIcon, 
    children,
    showGoBack = false,
    showMenu = false,
}: Props) =>  {

    const { top } = useSafeAreaInsets();
    const navigation = useNavigation();
    const canGoBack = showGoBack || navigation.canGoBack();
    // const { canGoBack, goBack } = useNavigation();

    const renderBackAction = () => (
        <TopNavigationAction
          icon={<MyIcon name="arrow-back-outline" />}
          onPress={() => navigation.goBack()}
        />
      );

      const renderMenuAction = () => (
        <TopNavigationAction
          icon={<MyIcon name="menu-outline" />}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      );

      const renderLeft = () => {
        if (canGoBack && showMenu) {
          return () => (
            <>
              <TopNavigationAction
                icon={<MyIcon name="arrow-back-outline" />}
                onPress={() => navigation.goBack()}
              />
              <TopNavigationAction
                icon={<MyIcon name="menu-outline" />}
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              />
            </>
          );
        }

        if (canGoBack) return renderBackAction;
        if (showMenu) return renderMenuAction;
        return undefined;
      };

      const renderRight = () => {
        if (!rightAction || !rightActionIcon) return undefined;
        return (
          <TopNavigationAction
            onPress={rightAction}
            icon={<MyIcon name={rightActionIcon} />}
          />
        );
      };

    return (
        <Layout style={{ paddingTop: top }}>
            <TopNavigation
                title={ title }
                subtitle={ subTitle }
                alignment='center'
                accessoryLeft={ renderLeft() }
                accessoryRight={ renderRight }
            />
            <Divider />

            <Layout style={{ height: '100%'}}>
                { children }
            </Layout>

        </Layout>
    );
};
