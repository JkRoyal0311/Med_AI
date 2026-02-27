/**
 * Disclaimer banner — shown on EVERY screen that displays medical info.
 */
import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <View className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mx-4 mb-3">
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="flex-row items-center gap-2"
      >
        <Ionicons name="warning" size={18} color="#D97706" />
        <Text className="text-amber-800 font-bold text-sm flex-1">
          ⚠️ Medical Disclaimer
        </Text>
        {compact && (
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16} color="#D97706"
          />
        )}
      </TouchableOpacity>

      {expanded && (
        <View>
          <Text className="text-amber-700 text-xs mt-2 leading-5">
            This information is AI-generated for educational purposes only.
            It is NOT medical advice, diagnosis, or prescription.{'\n\n'}
            Always consult a qualified doctor or pharmacist before taking
            any medication or making health decisions.
          </Text>
        </View>
      )}
    </View>
  );
}
