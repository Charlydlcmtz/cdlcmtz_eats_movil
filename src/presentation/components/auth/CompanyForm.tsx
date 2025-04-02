import { Input } from "@ui-kitten/components"
import { MyIcon } from "../ui/MyIcon"
import { ImageSelector } from "../shared/ImageSelector"
import { PasswordInput } from "../shared/PasswordInput";


export const CompanyForm = ({ form, setForm }: any) => {

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
                style={{ marginBottom: 10 }}
                value={ form.nombre }
                onChangeText={ (nombre) => setForm({ ...form, nombre}) }
            />
            <Input
                placeholder="RFC:"
                accessoryLeft={ <MyIcon name="file-text-outline" white /> }
                style={{ marginBottom: 10 }}
                value={ form.rfc }
                onChangeText={ (rfc) => setForm({ ...form, rfc}) }
            />
            <Input
                placeholder="Teléfono:"
                keyboardType="phone-pad"
                accessoryLeft={ <MyIcon name="phone-outline" white /> }
                style={{ marginBottom: 10 }}
                value={ form.telefono }
                onChangeText={ (telefono) => setForm({ ...form, telefono}) }
            />
            <Input
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                accessoryLeft={ <MyIcon name="email-outline" white /> }
                style={{ marginBottom: 10 }}
                value={ form.correo }
                onChangeText={ (correo) => setForm({ ...form, correo}) }
            />

            <Input
                placeholder="Colores"
                accessoryLeft={ <MyIcon name="color-palette-outline" white /> }
                style={{ marginBottom: 10 }}
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
