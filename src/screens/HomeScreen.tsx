import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useMealContext } from '../context/MealContext';
import CategoryCard from '../components/CategoryCard';
import MealCard from '../components/MealCard';
import ErrorState from '../components/ErrorState';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    categories,
    meals,
    selectedCategory,
    searchQuery,
    loading,
    error,
    selectCategory,
    searchMeals,
    refreshMeals,
  } = useMealContext();
  const { width } = useWindowDimensions();
  const isSmall = width < 380;

  const handleSelectCategory = async (category: string) => {
    await selectCategory(category);
  };

  const handleMealPress = (mealId: string, mealTitle: string) => {
    navigation.navigate('MealDetail', { mealId, mealTitle });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recettes</Text>
        <Text style={styles.subtitle}>Explorez, recherchez et découvrez de nouveaux plats.</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Rechercher un repas..."
          placeholderTextColor="#7a7a7a"
          value={searchQuery}
          onChangeText={searchMeals}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catégories</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.idCategory}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              active={item.strCategory === selectedCategory}
              onPress={() => handleSelectCategory(item.strCategory)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Repas</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333" />
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={refreshMeals} />
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <MealCard
              meal={item}
              onPress={() => handleMealPress(item.idMeal, item.strMeal)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.mealsList, isSmall && styles.mealsListCompact]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7fb',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f1f1f',
  },
  subtitle: {
    marginTop: 8,
    color: '#616161',
    fontSize: 15,
    lineHeight: 22,
  },
  searchBox: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f1f1f',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingBottom: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mealsList: {
    paddingBottom: 32,
  },
  mealsListCompact: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
