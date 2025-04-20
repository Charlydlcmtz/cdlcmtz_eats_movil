import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { Button, Icon, Layout, Text } from "@ui-kitten/components"
import { Image, StyleSheet, View } from "react-native"
import { useAuthStore } from "../../store/auth/useAuthStore";
import Toast from "react-native-toast-message";



export const CustomDrawer = (props: any) => {

  const { user, logout } = useAuthStore();
  const styles = createStyles();

  // 👇 Aseguramos la ruta completa si es necesario
  const userImage = user?.img_user
  ? user.img_user.startsWith('http')
      ? user.img_user
      : `http://192.168.0.16/api_cdlcmtz_eats/public/img_users/${user.img_user}`
  : null;
  const username = user?.username != '' ? user?.username : 'CDLCMTZ-EATS';

  const handleLogout = async () => {
    await logout();
    Toast.show({
      type: 'success',
      text1: 'Sesión cerrada',
      text2: 'Nos vemos pronto 👋',
    });
  };

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
            style={styles.img}
          />
          <Text
            category="h6"
            style={{ textAlign: "center", fontFamily: "System" }}
          >
            {username}
          </Text>
        </Layout>

        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Al final del DrawerContentScrollView: */}
      <Layout style={styles.centrar_elementos}>
        <Button
          onPress={handleLogout}
          status="danger"
          style={styles.logout}
          accessoryLeft={<Icon name="log-out-outline" fill="#fff" style={{ width: 20, height: 20 }} />}
        >
          Cerrar Sesión
        </Button>
      </Layout>
      <Layout style={styles.centrar_elementos}>
        <Text
          appearance="hint"
          style={styles.footer}
        >
          © Charly & Jimmy. Todos los derechos reservados, menos el derecho a
          soñar.
        </Text>
      </Layout>
    </Layout>
  );
};

const createStyles = () =>
  StyleSheet.create({
    img:{
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
    },
    centrar_elementos: {
      padding: 10,
      alignItems: "center",
    },
    logout: {
      backgroundColor: '#fa0202',
      color: '#fff',
    },
    footer: {
      fontSize: 12,
      textAlign: "center",
      fontFamily: "System",
    },
});