import { Image } from "react-native";
import { FadeInImage } from "../ui/FadeInImage";


interface Props {
    image: string;
}

export const UserImage = ({ image }: Props) => {
    return (
        <>
            {
                (image.length === 0)
                ? <Image source={ require('../../../assets/no-product-image.png') } style={{ width: 400, height: 300, marginHorizontal: 4 }} />
                : (
                    <FadeInImage
                    uri={image}
                    style={{ width: 400, height: 300, marginHorizontal: 4 }}
                    />
                )
            }
        </>
    );
}