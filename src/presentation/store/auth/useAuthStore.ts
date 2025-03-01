import { create } from "zustand";
import { User } from "../../../domain/entities/user";
import { AuthStatus } from "../../../infraestructure/interfaces/auth.status";
import { authCheckStatus, authLogin, authRegister } from "../../../actions/auth/auth";
import { StoragerAdapter } from '../../../config/adapters/storage-adapter';

export interface AuthState {
    status: AuthStatus
    token?: string;
    user?: User;

    login: (correo: string, password: string) => Promise<boolean>;
    register: (nombre: string, username: string, apellido_paterno: string, apellido_materno: string, telefono: string, no_empleado: string, 
        correo: string, password: string , password_confirm: string) => Promise<boolean>;
    checkStatus: () => Promise<void>
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()( (set, get) => ({
    status: 'checking',
    token: undefined,
    user: undefined,

    login: async (correo: string, password: string) => {
        const resp = await authLogin(correo, password);
        if (!resp) {
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return false;
        }

        //TODO: save token and user in storage
        await StoragerAdapter.setItem('token', resp.token);

        set({ status: 'authenticated', token: resp.token, user: resp.user });
        return true;
    },

    register: async (nombre: string, username: string, apellido_paterno: string, apellido_materno: string, telefono: string, no_empleado: string, 
        correo: string, password: string , password_confirm: string) => {
        const resp = await authRegister(nombre, username, apellido_paterno, apellido_materno, telefono, no_empleado, correo, password, password_confirm);

        if (!resp) {
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return false;
        }

        //TODO: save token and user in storage
        await StoragerAdapter.setItem('token', resp.token);

        set({ status: 'authenticated', token: resp.token, user: resp.user });
        return true;
    },

    checkStatus: async () => {
        const resp = await authCheckStatus();
        if ( !resp ) {
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return;
        }
        await StoragerAdapter.setItem('token', resp.token);
        set({ status: 'authenticated', token: resp.token, user: resp.user });
    },

    logout: async () => {
        await StoragerAdapter.removeItem('token');
        set({ status: 'unauthenticated', token: undefined, user: undefined});
    },
}));
