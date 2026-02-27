/**
 * Login Screen
 */
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  async function handleLogin() {
    if (!email || !pass) return Alert.alert('Please fill in all fields');
    setLoading(true);
    try {
      await login(email, pass);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login failed', e?.error || 'Check your email and password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <LinearGradient colors={['#0D7377', '#14BDAC', '#F8FAFB']}
        locations={[0, 0.4, 0.7]} className="flex-1">
        <View className="flex-1 justify-center px-6">
          <View className="items-center mb-10">
            <Text className="text-6xl mb-3">🏥</Text>
            <Text className="text-white text-4xl font-bold">MedAI</Text>
            <Text className="text-teal-100 mt-2 text-center">
              Your AI-powered health information guide
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-lg">
            <Text className="text-gray-800 text-xl font-bold mb-6">Sign In</Text>

            <TextInput
              className="bg-gray-50 rounded-2xl px-4 py-4 mb-3 text-gray-800 border border-gray-100"
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              className="bg-gray-50 rounded-2xl px-4 py-4 mb-5 text-gray-800 border border-gray-100"
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={pass}
              onChangeText={setPass}
              secureTextEntry
            />

            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              <LinearGradient colors={['#0D7377','#14BDAC']} className="rounded-2xl py-4 items-center">
                <Text className="text-white font-bold text-base">
                  {loading ? 'Signing in...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity className="mt-4 items-center"
              onPress={() => router.push('/(auth)/register')}>
              <Text className="text-gray-500">
                Don't have an account?{' '}
                <Text className="text-teal-600 font-bold">Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6 px-2">
            <Text className="text-teal-100 text-xs text-center leading-5">
              ⚠️ MedAI provides health information for educational purposes only.
              Always consult a qualified healthcare professional for medical advice.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
