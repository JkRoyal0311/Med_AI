/**
 * Register Screen
 */
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/authStore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  async function handleRegister() {
    if (!name || !email || !pass) return Alert.alert('Please fill in required fields');
    setLoading(true);
    try {
      await register({ name, email, password: pass, age: age ? parseInt(age) : null });
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.error || 'Please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <LinearGradient colors={['#0D7377', '#14BDAC', '#F8FAFB']} locations={[0, 0.4, 0.7]} className="flex-1">
        <ScrollView className="flex-1 pt-8">
          <View className="px-6">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Text className="text-white text-base">← Back</Text>
            </TouchableOpacity>

            <View className="items-center mb-8">
              <Text className="text-6xl mb-2">🏥</Text>
              <Text className="text-white text-3xl font-bold">Create Account</Text>
            </View>

            <View className="bg-white rounded-3xl p-6 shadow-lg">
              <TextInput
                className="bg-gray-50 rounded-2xl px-4 py-3 mb-3 text-gray-800 border border-gray-100"
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                className="bg-gray-50 rounded-2xl px-4 py-3 mb-3 text-gray-800 border border-gray-100"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                className="bg-gray-50 rounded-2xl px-4 py-3 mb-3 text-gray-800 border border-gray-100"
                placeholder="Password"
                value={pass}
                onChangeText={setPass}
                secureTextEntry
              />

              <TextInput
                className="bg-gray-50 rounded-2xl px-4 py-3 mb-5 text-gray-800 border border-gray-100"
                placeholder="Age (optional)"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
              />

              <TouchableOpacity onPress={handleRegister} disabled={loading}>
                <LinearGradient colors={['#0D7377','#14BDAC']} className="rounded-2xl py-4 items-center">
                  <Text className="text-white font-bold text-base">
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity className="mt-3 items-center"
                onPress={() => router.push('/(auth)/login')}>
                <Text className="text-gray-500 text-sm">
                  Already have an account?{' '}
                  <Text className="text-teal-600 font-bold">Sign in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
