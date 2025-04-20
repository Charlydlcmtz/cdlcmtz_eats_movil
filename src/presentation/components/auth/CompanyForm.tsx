import { Input } from "@ui-kitten/components"
import { MyIcon } from "../ui/MyIcon"
import { ImageSelector } from "../shared/ImageSelector"
import { PasswordInput } from "../shared/PasswordInput";
import { StyleSheet, useColorScheme } from "react-native";


export const CompanyForm = ({ form, setForm }: any) => {
    const isDarkMode = useColorScheme() === 'dark';
    const styles = createStyles(isDarkMode);

    return (
        <>
            <ImageSelector
                imageUri={form.icon}
                onImageSelected={(icon) => setForm({ ...form, icon })}
                label="Foto de perfil"
            />
            <Input
                placeholder="Empresa:"
                accessoryLeft={ <MyIcon name="briefcase-outline" white /> }
                style={styles.input}
                value={ form.nombre }
                onChangeText={ (nombre) => setForm({ ...form, nombre}) }
            />
            <Input
                placeholder="RFC:"
                accessoryLeft={ <MyIcon name="file-text-outline" white /> }
                style={styles.input}
                value={ form.rfc }
                onChangeText={ (rfc) => setForm({ ...form, rfc}) }
            />
            <Input
                placeholder="Teléfono:"
                keyboardType="phone-pad"
                accessoryLeft={ <MyIcon name="phone-outline" white /> }
                style={styles.input}
                value={ form.telefono }
                onChangeText={ (telefono) => setForm({ ...form, telefono}) }
            />
            <Input
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                accessoryLeft={ <MyIcon name="email-outline" white /> }
                style={styles.input}
                value={ form.correo }
                onChangeText={ (correo) => setForm({ ...form, correo}) }
            />

            <Input
                placeholder="Colores"
                accessoryLeft={ <MyIcon name="color-palette-outline" white /> }
                style={styles.input}
                value={ form.colors }
                onChangeText={ (colors) => setForm({ ...form, colors}) }
            />

            <PasswordInput
                placeholder="Contraseña"
                value={form.password ?? ''}
                onChangeText={(password) => setForm({...form, password})}
            />

            <PasswordInput
                placeholder="Confirmar Contraseña"
                value={form.password_confirm ?? ''}
                onChangeText={(password_confirm) => setForm({...form, password_confirm})}
            />
        </>
    );
};

const createStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
      input: {
        marginBottom: 10,
        backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF20',
        borderColor: isDarkMode ? '#555' : '#FFFFFF55',
        color: isDarkMode ? '#FFFFFF' : '#000000',
      },
});