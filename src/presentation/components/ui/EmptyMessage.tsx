// src/components/ui/EmptyMessage.tsx
import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet, Image } from 'react-native';

interface Props {
  message: string;
  image?: any;
}

export const EmptyMessage = ({ message, image }: Props) => {
  return (
    <Layout style={styles.container}>
      {image && (
        <Image
          source={image}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <Text category="s1" style={styles.text}>
        {message}
      </Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    opacity: 0.6,
  },
});