/**
 * Home Screen - Main dashboard
 */
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { SearchBar } from '../../components/ui/SearchBar';
import { DisclaimerBanner } from '../../components/ui/DisclaimerBanner';
import { useQuery } from '@tanstack/react-query';
import { medicalAPI } from '../../services/api';

const QUICK_SEARCHES = [
  { label: 'Diabetes', emoji: '🩸', color: ['#FEE2E2','#FECACA'] },
  { label: 'Hypertension', emoji: '❤️', color: ['#FCE7F3','#FBCFE8'] },
  { label: 'Hypothyroidism', emoji: '🦋', color: ['#EDE9FE','#DDD6FE'] },
];

const FEATURES = [
  { icon: '🔍', label: 'Disease\nGuide', route: '/search', color: '#0D7377' },
  { icon: '💊', label: 'Drug\nInfo', route: '/search', color: '#7C3AED' },
  { icon: '🩺', label: 'Symptom\nCheck', route: '/symptoms', color: '#DC2626' },
  { icon: '🤖', label: 'AI\nChat', route: '/(tabs)/chat', color: '#D97706' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const { data: history } = useQuery({
    queryKey: ['history'],
    queryFn: () => medicalAPI.getHistory() as any,
    staleTime: 60000,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  function handleQuickSearch(label: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/result', params: { query: label, type: 'disease' } });
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* HERO HEADER */}
        <LinearGradient colors={['#0D7377', '#14BDAC']} className="pb-8 px-6 pt-4">
          <View>
            <Text className="text-teal-100 text-sm">{greeting} 👋</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              {user?.name ?? 'Welcome to MedAI'}
            </Text>
            <Text className="text-teal-100 text-sm mt-1">
              Your AI-powered health guide
            </Text>
          </View>

          {/* SEARCH BAR INSIDE HEADER */}
          <View className="mt-5 bg-white rounded-2xl flex-row items-center px-4 py-3">
            <Ionicons name="search" size={20} color="#0D7377" />
            <TouchableOpacity
              className="flex-1 ml-3"
              onPress={() => router.push('/search')}
            >
              <Text className="text-gray-400 text-base">
                Search disease, drug, or symptom...
              </Text>
            </TouchableOpacity>
            <Ionicons name="mic" size={20} color="#0D7377" />
          </View>
        </LinearGradient>

        {/* DISCLAIMER */}
        <View className="mt-4">
          <DisclaimerBanner compact />
        </View>

        {/* FEATURE GRID */}
        <View className="px-4 mt-2">
          <Text className="text-gray-800 font-bold text-lg mb-3">Features</Text>
          <View className="flex-row flex-wrap gap-3">
            {FEATURES.map((f, i) => (
              <View key={f.route} className="flex-1 min-w-[22%]">
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push(f.route as any);
                  }}
                  className="items-center bg-white rounded-3xl py-4 shadow-sm"
                  style={{ borderTopWidth: 3, borderTopColor: f.color }}
                >
                  <Text className="text-3xl">{f.icon}</Text>
                  <Text className="text-xs text-gray-600 font-semibold mt-2 text-center">
                    {f.label}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* QUICK SEARCH CONDITIONS */}
        <View className="px-4 mt-6 mb-4">
          <Text className="text-gray-800 font-bold text-lg mb-3">
            Common Conditions
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {QUICK_SEARCHES.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => handleQuickSearch(item.label)}
              >
                <LinearGradient
                  colors={item.color as any}
                  className="flex-row items-center px-4 py-3 rounded-2xl"
                >
                  <Text className="text-xl mr-2">{item.emoji}</Text>
                  <Text className="text-gray-700 font-semibold text-sm">
                    {item.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
