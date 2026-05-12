import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { fetchMealDetailById } from '../services/mealsService';
import { parseIngredients } from '../utils/mealUtils';
import ErrorState from '../components/ErrorState';

type DetailRouteProp = RouteProp<RootStackParamList, 'MealDetail'>;

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper function to format instructions with numbers
const formatInstructions = (text: string): Array<{ number: number; step: string }> => {
  if (!text) return [];
  // Split by periods and filter empty entries
  const steps = text
    .split('.')
    .map((step) => step.trim())
    .filter((step) => step.length > 0);
  
  return steps.map((step, index) => ({
    number: index + 1,
    step,
  }));
};

export default function MealDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const { mealId, mealTitle } = route.params;
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMealDetailById(mealId);
      if (!data) {
        setError('Détails du repas introuvables.');
        return;
      }
      setMeal(data);
    } catch (err) {
      setError('Impossible de charger les informations du repas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [mealId]);

  const embedVideoId = meal?.strYoutube ? getYouTubeVideoId(meal.strYoutube) : null;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => loadDetail()} />;
  }

  const ingredients = meal ? parseIngredients(meal) : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image 
        source={{ uri: meal.strMealThumb }} 
        style={styles.heroImage} 
      />
      <View style={styles.detailBox}>
        <Text style={styles.title}>{mealTitle}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.tag}>{meal.strCategory}</Text>
          <Text style={styles.tag}>{meal.strArea}</Text>
        </View>

        {meal.strYoutube && (
          <View style={styles.videoSection}>
            <Text style={styles.sectionTitle}>Vidéo de Préparation</Text>
            {embedVideoId ? (
              <View style={styles.youtubeEmbedWrapper}>
                {Platform.OS === 'web' ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${embedVideoId}?modestbranding=1&rel=0`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: '16px' }}
                  />
                ) : (
                  <WebView
                    source={{ uri: `https://www.youtube.com/embed/${embedVideoId}?modestbranding=1&rel=0` }}
                    style={styles.youtubeWebView}
                    allowsFullscreenVideo
                    javaScriptEnabled
                    domStorageEnabled
                  />
                )}
              </View>
            ) : (
              <Text style={styles.subtitle}>Lien YouTube invalide ou vidéo non trouvée.</Text>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingrédients</Text>
          {ingredients.map((item) => (
            <View key={`${item.label}-${item.value}`} style={styles.ingredientRow}>
              <Image source={{ uri: item.imageUrl }} style={styles.ingredientImage} />
              <View style={styles.ingredientInfo}>
                <Text style={styles.ingredientLabel}>{item.label}</Text>
                <Text style={styles.ingredientValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions Étape par Étape</Text>
          {formatInstructions(meal.strInstructions).map((instruction) => (
            <View key={instruction.number} style={styles.instructionRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{instruction.number}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction.step}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7fb',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: 260,
  },
  detailBox: {
    backgroundColor: '#ffffff',
    marginTop: -28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1d1d1d',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#eef2ff',
    color: '#3b3b98',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 13,
    fontWeight: '600',
  },
  videoSection: {
    marginTop: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  youtubeEmbedWrapper: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  youtubeWebView: {
    flex: 1,
    backgroundColor: '#000',
  },
  ingredientImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#fff',
  },
  ingredientInfo: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    color: '#1f1f1f',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f5f6fb',
    borderRadius: 14,
  },
  ingredientLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  ingredientValue: {
    fontSize: 15,
    color: '#555',
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#f5f6fb',
    borderRadius: 14,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  stepNumberText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
