import { Image } from "react-native";
import { FadeInImage } from "../ui/FadeInImage";


interface Props {
    image: string;
}

export const FoodImage = ({ image }: Props) => {
    return (
        <>
            {
                (image.length === 0)
                ?   <Image source={ require('../../../assets/no-product-image.png') }
                        style={{
                            width: '100%',
                            height: 160,
                            borderRadius: 20,
                        }}
                        resizeMode="cover"
                    />
                : (
                    <FadeInImage
                        uri={image}
                        style={{
                            width: '100%',
                            height: 400,
                            borderRadius: 20,
                        }}
                    />
                )
            }
        </>
    );
}