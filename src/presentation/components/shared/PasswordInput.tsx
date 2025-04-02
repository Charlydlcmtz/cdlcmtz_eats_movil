import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MyIcon } from '../ui/MyIcon';
import { Input } from '@ui-kitten/components';


interface Props {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
}

export const PasswordInput = ({ placeholder, value, onChangeText }: Props) => {

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
            style={{ marginBottom: 10 }}
            value={ value }
            onChangeText={ onChangeText }
        />
    )
}
