/**
 * Simple Profile Screen 
 */
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Profile</Text>

        <View className="bg-white rounded-3xl p-6 mb-4">
          <Text className="text-gray-500 text-sm mb-1">Name</Text>
          <Text className="text-2xl font-bold text-gray-800 mb-4">{user?.name}</Text>

          <Text className="text-gray-500 text-sm mb-1">Email</Text>
          <Text className="text-lg text-gray-600">{user?.email}</Text>
        </View>

        <View className="my-4">
          <Text className="text-amber-700 text-xs p-4 bg-amber-50 rounded-2xl border border-amber-200">
            ⚠️ This app provides AI-generated medical information for educational purposes only.
            It is NOT a substitute for professional medical advice. Always consult a doctor.
          </Text>
        </View>

        <View className="flex-1" />

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 rounded-2xl py-4 items-center mb-6"
        >
          <Text className="text-white font-bold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
