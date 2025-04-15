import { cdlcmtzEatsApi } from "../../config/api/cdlcmtzEatsApi"
import { User } from "../../domain/entities/user";
import type { AuthResponse } from "../../infraestructure/interfaces/auth.responses";
import { BasicResponse } from "../../infraestructure/interfaces/basic.response";


const returnUserToken = ( data: AuthResponse ) => {
    const user: User = {
        id: data.user.id,
        username: data.user.username,
        no_empleado: data.user.no_empleado,
        img_user: data.user.img_user,
        correo: data.user.correo,
        telefono: data.user.telefono,
        id_empresa: data.user.id_empresa,
        role: data.user.role,
    };
    return {
        user: user,
        token: data.token,
    };
};

const returnBasic = ( data: BasicResponse ) => {
    return {
        mensaje: data.mensaje,
        estatus: data.estatus,
        codigo: data.codigo,
    };
};

export const authLogin = async(correo: string, password: string) => {

    correo = correo.toLocaleLowerCase();

    try {
        const { data } = await cdlcmtzEatsApi.post<AuthResponse>('/login', {
            correo,
            password,
        });

        return returnUserToken(data);
    }catch(error){
        console.log(error);
        return null;
    }
};

export const authRegister = async(payload : any) => {

    try {
        const {
            nombre,
            username,
            apellido_p,
            apellido_m,
            telefono,
            no_empleado,
            rfc,
            correo,
            img_user,
            icon,
            password,
            password_confirm,
            tipo_usuario,
        } = payload;

        // Validación de contraseñas
        if (password !== password_confirm) {
            throw new Error("Las contraseñas no son iguales.");
        }

        // Seleccionar endpoint según tipo
        const endpoint = tipo_usuario === 'empresa' ? '/register-company-movil' : '/register-movil';

        const dataToSend = {
            nombre: nombre?.toLowerCase(),
            username: username?.toLowerCase(),
            apellido_p: apellido_p?.toLowerCase(),
            apellido_m: apellido_m?.toLowerCase(),
            correo: correo?.toLowerCase(),
            img_user,
            icon,
            telefono,
            no_empleado,
            rfc,
            password,
        };

        const { data } = await cdlcmtzEatsApi.post<AuthResponse>(endpoint, dataToSend);
        return returnUserToken(data);

    } catch (error) {
        console.log("Error en authRegister:", error);
        return null;
    }
};

export const authForgotPassword = async(correo: string, tipo_app: string) => {
    try {
        if (correo === '') {
            throw new Error("El correo no es valido.");
        }

        const dataToSend = {
            correo: correo?.toLowerCase(),
            tipo_app,
        };

        const { data } = await cdlcmtzEatsApi.post<BasicResponse>('/codigo', dataToSend);
        return returnBasic(data);

    } catch (error) {
        console.log("Error en authRegister:", error);
        return null;
    }
};

export const authCheckStatus = async (token: string) => {
    try {
        const { data } = await cdlcmtzEatsApi.post<AuthResponse>('/check-token', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return data;
    } catch (error) {
        return null;
    }
};