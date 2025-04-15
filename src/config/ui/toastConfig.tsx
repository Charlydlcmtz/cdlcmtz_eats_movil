import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { StyleSheet } from "react-native";


export const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={[styles.base, styles.success]}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={styles.text1}
            text2Style={styles.text2}
        />
    ),
        error: (props: any) => (
        <ErrorToast
            {...props}
            style={[styles.base, styles.error]}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={styles.text1}
            text2Style={styles.text2}
        />
    ),
};

const styles = StyleSheet.create({
    base: {
      borderLeftWidth: 0,
      borderRadius: 12,
      elevation: 4,
      shadowColor: '#000',
      marginHorizontal: 15,
    },
    success: {
      backgroundColor: '#4BB543',
    },
    error: {
      backgroundColor: '#FF4B4B',
    },
    text1: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
    text2: {
      fontSize: 14,
      color: 'white',
    },
  });