import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { Layout, Text } from "@ui-kitten/components"
import { Image, View } from "react-native"
import { useAuthStore } from "../../store/auth/useAuthStore";



export const CustomDrawer = (props: any) => {

    const { user } = useAuthStore();

    // 👇 Aseguramos la ruta completa si es necesario
    const userImage = user?.img_user
    ? user.img_user.startsWith('http')
        ? user.img_user
        : `http://192.168.0.17/api_cdlcmtz_eats/public/img_users/${user.img_user}`
    : null;

  return (
    <Layout style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Layout style={{ padding: 20, alignItems: "center" }}>
          <Image
            source={
              userImage
                ? { uri: userImage }
                : require("../../../assets/no-product-image.png")
            }
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text
            category="h6"
            style={{ textAlign: "center", fontFamily: "System" }}
          >
            CDLCMTZ-EATS
          </Text>
        </Layout>

        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <Layout style={{ padding: 10, alignItems: "center" }}>
        <Text
          appearance="hint"
          style={{
            fontSize: 12,
            textAlign: "center",
            fontFamily: "System",
          }}
        >
          © Charly & Jimmy. Todos los derechos reservados, menos el derecho a
          soñar.
        </Text>
      </Layout>
    </Layout>
  );
};