/**
 * Disease/Drug Result Display Screen
 */
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { medicalAPI } from '../services/api';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { MedCard } from '../components/ui/MedCard';

export default function ResultScreen() {
  const { query, type } = useLocalSearchParams<{ query: string; type: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['result', type, query],
    queryFn: () => {
      if (type === 'disease') return medicalAPI.getDiseaseInfo(query) as any;
      if (type === 'drug') return medicalAPI.getDrugInfo(query) as any;
      return null;
    },
    staleTime: 3600000,
  });

  const content: string = data?.content ?? data?.analysis ?? '';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={['#0D7377', '#14BDAC']} className="px-4 pt-4 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-3">
          <Ionicons name="arrow-back" size={22} color="white" />
          <Text className="text-white ml-2">Back</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-teal-100 text-sm capitalize">{type} Information</Text>
          <Text className="text-white text-2xl font-bold mt-1">{query}</Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="mt-4">
          <DisclaimerBanner compact />
        </View>

        {isLoading && (
          <View className="items-center py-16 px-6">
            <ActivityIndicator size="large" color="#0D7377" />
            <Text className="text-teal-700 font-semibold text-lg mt-4">
              Meditron is analyzing...
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Medical AI processing takes 10-30 seconds.{'\n'}
              Gathering information about {query}...
            </Text>
          </View>
        )}

        {error && (
          <View className="m-4 p-4 bg-red-50 rounded-2xl border border-red-200">
            <Text className="text-red-700 font-bold">Could not load information</Text>
            <Text className="text-red-600 text-sm mt-1">
              Please check your connection and try again.
            </Text>
          </View>
        )}

        {!isLoading && content && (
          <MedCard title={query} emoji={type === 'disease' ? '🏥' : '💊'}>
            <Text className="text-gray-700 text-sm leading-6">{content}</Text>
          </MedCard>
        )}

        {data?.sources?.length > 0 && (
          <View className="mx-4 mb-4 p-4 bg-gray-100 rounded-2xl">
            <Text className="text-gray-600 text-xs font-semibold mb-1">
              Sources used:
            </Text>
            <Text className="text-gray-500 text-xs">
              {data.sources.join(' · ')}
            </Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
