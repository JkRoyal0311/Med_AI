/**
 * Search Tab - Unified search for disease or drug
 */
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

type SearchType = 'disease' | 'drug';

const DISEASE_EXAMPLES = [
  { name: 'Type 2 Diabetes', emoji: '🩸' },
  { name: 'Hypertension', emoji: '❤️' },
  { name: 'Hypothyroidism', emoji: '🦋' },
];

const DRUG_EXAMPLES = [
  { name: 'Metformin', emoji: '💊' },
  { name: 'Amlodipine', emoji: '❤️' },
  { name: 'Paracetamol', emoji: '🔵' },
];

export default function SearchScreen() {
  const [mode, setMode] = useState<SearchType>('disease');
  const router = useRouter();

  function go(query: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: '/result', params: { query, type: mode } });
  }

  const examples = mode === 'disease' ? DISEASE_EXAMPLES : DRUG_EXAMPLES;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={mode === 'disease' ? ['#0D7377','#14BDAC'] : ['#7C3AED','#A78BFA']}
          className="px-4 pt-4 pb-8"
        >
          <Text className="text-white text-2xl font-bold">
            {mode === 'disease' ? '🏥 Disease Search' : '💊 Drug Lookup'}
          </Text>
          <Text className="text-white/70 text-sm mt-1">
            {mode === 'disease'
              ? 'Get medications, food guide & symptoms'
              : 'Get drug info, side effects & interactions'}
          </Text>

          {/* Mode toggle */}
          <View className="flex-row bg-white/20 rounded-2xl p-1 mt-4">
            {(['disease', 'drug'] as SearchType[]).map(m => (
              <TouchableOpacity key={m} onPress={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl items-center ${mode === m ? 'bg-white' : ''}`}>
                <Text className={`font-semibold text-sm ${
                  mode === m ? (m === 'disease' ? 'text-teal-700' : 'text-purple-700') : 'text-white'
                }`}>
                  {m === 'disease' ? '🏥 Disease' : '💊 Drug'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        <View className="px-4 mt-2">
          <Text className="text-gray-600 font-semibold mb-3">Quick Select:</Text>
          <View className="flex-row flex-wrap gap-3">
            {examples.map((item) => (
              <TouchableOpacity key={item.name} onPress={() => go(item.name)}
                className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                <Text className="text-xl mr-2">{item.emoji}</Text>
                <Text className="text-gray-700 font-medium text-sm">{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
