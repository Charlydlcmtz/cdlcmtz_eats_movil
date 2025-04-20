import { Input } from '@ui-kitten/components';
import { MyIcon } from '../ui/MyIcon';
import { ImageSelector } from '../shared/ImageSelector';
import { PasswordInput } from '../shared/PasswordInput';
import { StyleSheet, useColorScheme } from 'react-native';

export const UserForm = ({ form, setForm }: any ) => {
    const isDarkMode = useColorScheme() === 'dark';
    const styles = createStyles(isDarkMode);

    return (
        <>
            <ImageSelector
                imageUri={form.img_user}
                onImageSelected={(img_user) => setForm({ ...form, img_user })}
                label="Foto de perfil"
            />
            <Input
                placeholder="Nombre:"
                accessoryLeft={ <MyIcon name="person-outline" white /> }
                style={styles.input}
                value={ form.nombre }
                onChangeText={ (nombre) => setForm({ ...form, nombre}) }
            />
            <Input
                placeholder="Username:"
                accessoryLeft={ <MyIcon name="person-outline" white /> }
                style={styles.input}
                value={ form.username }
                onChangeText={ (username) => setForm({ ...form, username}) }
            />
            <Input
                placeholder="Apellido Paterno:"
                accessoryLeft={ <MyIcon name="person-outline" white /> }
                style={styles.input}
                value={ form.apellido_paterno }
                onChangeText={ (apellido_paterno) => setForm({ ...form, apellido_paterno}) }
            />
            <Input
                placeholder="Apellido Materno:"
                accessoryLeft={ <MyIcon name="person-outline" white /> }
                style={styles.input}
                value={ form.apellido_materno }
                onChangeText={ (apellido_materno) => setForm({ ...form, apellido_materno}) }
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
                placeholder="No° Empleado:"
                keyboardType="number-pad"
                accessoryLeft={ <MyIcon name="briefcase-outline" white /> }
                style={styles.input}
                value={ form.no_empleado }
                onChangeText={ (no_empleado) => setForm({ ...form, no_empleado}) }
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