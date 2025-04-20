import { useState } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { MyIcon } from '../ui/MyIcon';
import { Input } from '@ui-kitten/components';


interface Props {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
}

export const PasswordInput = ({ placeholder, value, onChangeText }: Props) => {

    const isDarkMode = useColorScheme() === 'dark';
    const styles = createStyles(isDarkMode);
    const [visible, setVisible] = useState(false);

    return (
        <Input
            placeholder={placeholder}
            autoCapitalize="none"
            secureTextEntry={!visible}
            accessoryLeft={ <MyIcon name='lock-outline' white /> }
            accessoryRight={
                <TouchableOpacity onPress={() => setVisible(!visible)}>
                    <MyIcon name={ visible ? 'eye-outline' : 'eye-off-outline' } white />
                </TouchableOpacity>
            }
            style={styles.input}
            value={ value }
            onChangeText={ onChangeText }
        />
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