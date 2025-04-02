import { Alert, StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { CameraAdapter } from "../../../config/adapters/camera-adapter";
import { Text } from "@ui-kitten/components";
import { MyIcon } from "../ui/MyIcon";


interface Props {
    imageUri?: string;
    onImageSelected: (uri: string) => void;
    label?: string;
    icon?: string;
}

export const ImageSelector = ({ imageUri, onImageSelected, label = 'Imagen', icon = 'camera-outline' }: Props) => {

    const handleSelectImage = async () => {
        Alert.alert('Selecciona una opcion', '', [
            {
                text: 'Tomar foto',
                onPress: async () => {
                    const uri = await CameraAdapter.takePicture();
                    if (uri) onImageSelected(uri);
                },
            },
            {
                text: 'Elegir de galería',
                onPress: async () => {
                    const uri = await CameraAdapter.getPicturesFromLibrary();
                    if (uri) onImageSelected(uri);
                },
            },
            { text: 'Cancelar', style: 'cancel' },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label} > {label} </Text>
            <TouchableOpacity style={ styles.imageContainer } onPress={handleSelectImage}>
                { imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <MyIcon name={ icon } white />
                        <Text style={styles.placeholderText} > Agregar imagen </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
    },
    imageContainer:{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 100,
        padding: 4,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    placeholder: {
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 10,
        marginTop: 5,
        color: '#888',
    },
});