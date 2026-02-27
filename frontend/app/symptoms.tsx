/**
 * Symptom Checker Screen
 */
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useMutation } from '@tanstack/react-query';
import { medicalAPI } from '../services/api';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';

const COMMON_SYMPTOMS = [
  'Fatigue', 'Headache', 'Fever', 'Nausea', 'Chest pain',
  'Shortness of breath', 'Blurred vision', 'Frequent urination',
  'Weight loss', 'Joint pain',
];

export default function SymptomCheckerScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (symptoms: string[]) =>
      medicalAPI.predictDisease(symptoms) as any,
    onSuccess: (data) => {
      router.push({
        pathname: '/result',
        params: { data: JSON.stringify(data), type: 'symptom' }
      });
    },
    onError: () => Alert.alert('Error', 'Could not analyze symptoms. Please try again.'),
  });

  function toggleSymptom(s: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  function addCustom() {
    const s = custom.trim();
    if (s && !selected.includes(s)) {
      setSelected(prev => [...prev, s]);
      setCustom('');
    }
  }

  function analyze() {
    if (selected.length === 0) return Alert.alert('Add symptoms', 'Please select or type at least one symptom');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    mutation.mutate(selected);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#DC2626', '#EF4444']} className="px-4 pt-4 pb-8">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
            <Ionicons name="arrow-back" size={22} color="white" />
            <Text className="text-white ml-2">Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">🩺 Symptom Checker</Text>
          <Text className="text-red-100 mt-2 text-sm leading-5">
            Select your symptoms and AI will suggest possible conditions.{'\n'}
            This is NOT a diagnosis — always see a doctor.
          </Text>
        </LinearGradient>

        <View className="mt-4">
          <DisclaimerBanner />
        </View>

        {selected.length > 0 && (
          <View className="mx-4 mb-4">
            <Text className="text-gray-700 font-semibold mb-2">
              Selected ({selected.length}):
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {selected.map(s => (
                <TouchableOpacity key={s} onPress={() => toggleSymptom(s)}>
                  <LinearGradient colors={['#DC2626','#EF4444']}
                    className="flex-row items-center px-3 py-2 rounded-full">
                    <Text className="text-white text-sm font-medium mr-1">{s}</Text>
                    <Ionicons name="close" size={14} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View className="mx-4 mb-4 flex-row gap-2">
          <TextInput
            className="flex-1 bg-white rounded-2xl px-4 py-3 border border-gray-100 text-gray-800"
            placeholder="Type a symptom..."
            placeholderTextColor="#9CA3AF"
            value={custom}
            onChangeText={setCustom}
            onSubmitEditing={addCustom}
          />
          <TouchableOpacity onPress={addCustom}
            className="bg-red-500 rounded-2xl px-4 items-center justify-center">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-4 mb-6">
          <Text className="text-gray-700 font-semibold mb-3">Common Symptoms:</Text>
          <View className="flex-row flex-wrap gap-2">
            {COMMON_SYMPTOMS.map((s) => {
              const isSelected = selected.includes(s);
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => toggleSymptom(s)}
                  className={`px-4 py-2 rounded-full border ${
                    isSelected
                      ? 'bg-red-500 border-red-500'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-gray-600'
                  }`}>
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="px-4 mb-8">
          <TouchableOpacity onPress={analyze} disabled={mutation.isPending}>
            <LinearGradient
              colors={selected.length > 0 ? ['#DC2626','#EF4444'] : ['#D1D5DB','#E5E7EB']}
              className="rounded-3xl py-4 items-center"
            >
              {mutation.isPending ? (
                <Text className="text-white font-bold text-base">
                  🤖 Analyzing symptoms...
                </Text>
              ) : (
                <Text className={`font-bold text-base ${selected.length > 0 ? 'text-white' : 'text-gray-400'}`}>
                  Analyze {selected.length > 0 ? `${selected.length} Symptom${selected.length > 1 ? 's' : ''}` : 'Symptoms'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
