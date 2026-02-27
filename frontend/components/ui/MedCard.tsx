/**
 * universal medical info card with animated entrance.
 */
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MedCardProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
  gradientColors?: string[];
}

export function MedCard({
  title, emoji, children,
  gradientColors = ['#FFFFFF', '#F8FAFB'],
}: MedCardProps) {
  return (
    <View className="mx-4 mb-4 rounded-3xl overflow-hidden shadow-sm">
      <LinearGradient colors={gradientColors} className="p-5">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-10 h-10 bg-white/50 rounded-2xl items-center justify-center">
            <Text className="text-2xl">{emoji}</Text>
          </View>
          <Text className="text-gray-800 font-bold text-lg flex-1">{title}</Text>
        </View>
        {children}
      </LinearGradient>
    </View>
  );
}
