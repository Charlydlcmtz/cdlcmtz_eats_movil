import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { Layout, Text } from "@ui-kitten/components"
import { Image, View } from "react-native"

export const CustomDrawer = (props: any) => {
  return (
    <DrawerContentScrollView { ...props }>
        <Layout style={{ padding: 20, alignItems: 'center' }}>
            <Image
                source={require('../../../assets/no-product-image.png')}
                style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
            />
            <Text category="h6" style={{ textAlign: 'center', fontFamily: 'System' }}>
                CDLCMTZ-EATS
            </Text>
        </Layout>

        <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <DrawerItemList {...props} />
        </View>

        <Layout style={{ padding: 10, alignItems: 'center' }} >
            <Text appearance="hint" style={{ fontSize: 12, textAlign: 'center', fontFamily: 'System' }}>
                © Charly & Jimmy. Todos los derechos reservados, menos el derecho a soñar.
            </Text>
        </Layout>
    </DrawerContentScrollView>
  );
};