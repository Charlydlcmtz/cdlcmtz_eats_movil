import {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageStyle,
  StyleProp,
  View,
} from 'react-native';
import {useAnimation} from '../../hooks/useAnimation';

interface Props {
  uri: string;
  style?: StyleProp<ImageStyle>;
}

export const FadeInImage = ({uri, style}: Props) => {
  const {animatedOpacity, fadeIn} = useAnimation();
  const [isLoading, setIsLoading] = useState(true);

  const isDisposed = useRef(false);

  useEffect(() => {
    return () => {
      isDisposed.current = true;
    };
  }, []);

  const onLoadEnd = () => {
    if (isDisposed.current) return;
    fadeIn({});
    setIsLoading(false);
  };

  return (
    <View style={[{ width: '100%', height: 200, overflow: 'hidden' }, style]}>
      {isLoading && (
        <ActivityIndicator
        style={{ position: 'absolute', alignSelf: 'center', top: '50%' }}
          color="grey"
          size={30}
        />
      )}

      <Animated.Image
        source={{uri}}
        onLoadEnd={onLoadEnd}
        style={[
          {
            width: '100%',
            height: '100%',
            resizeMode: 'cover', // Cambiado a 'cover' para que llene el espacio
            opacity: animatedOpacity,
          },
          style,
        ]}
      />
    </View>
  );
};
