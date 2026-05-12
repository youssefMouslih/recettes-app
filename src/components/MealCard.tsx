import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MealSummary } from '../context/MealContext';

type Props = {
  meal: MealSummary;
  onPress: () => void;
};

export default function MealCard({ meal, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.title}>
          {meal.strMeal}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 220,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    marginHorizontal: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    width: '100%',
    height: 140,
  },
  info: {
    padding: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f1f1f',
    lineHeight: 22,
  },
});
