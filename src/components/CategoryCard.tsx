import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Category } from '../context/MealContext';

type Props = {
  category: Category;
  active: boolean;
  onPress: () => void;
};

export default function CategoryCard({ category, active, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.card, active && styles.activeCard]}>
      <Image source={{ uri: category.strCategoryThumb }} style={styles.image} />
      <View style={styles.labelContainer}>
        <Text style={[styles.label, active && styles.activeLabel]}>{category.strCategory}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 150,
    borderRadius: 20,
    marginRight: 14,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
    overflow: 'hidden',
  },
  activeCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  image: {
    width: '100%',
    height: 92,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#242424',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#1d4ed8',
  },
});
