import React, { PropsWithChildren, useEffect } from 'react';
import { RootStackParams } from '../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/auth/useAuthStore';

export const AuthProvider = ({children}: PropsWithChildren) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
    const { checkStatus, status } = useAuthStore();

    useEffect(() => {
        checkStatus();
    }, []);

    useEffect(() => {
        if ( status !== 'checking' ) {
            if ( status === 'authenticated' ) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen', params: { initialTab: 'CreateOrderScreen' } }],
                });
            }else{
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'LoginScreen' }],
                });
            }
        }
    }, [status]);

    return (
        <>{ children }</>
    );
};
