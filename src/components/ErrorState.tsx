import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  message: string;
  onRetry: () => void;
};

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oups...</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Réessayer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1f1f1f',
  },
  message: {
    textAlign: 'center',
    color: '#555',
    fontSize: 15,
    marginBottom: 16,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
