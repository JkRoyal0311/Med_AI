/**
 * Animated search bar with auto-complete suggestions.
 */
import { View, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { medicalAPI } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  placeholder: string;
  onSubmit: (query: string) => void;
  onSelect?: (item: any) => void;
}

export function SearchBar({ placeholder, onSubmit, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any>({ diseases: [], medicines: [] });
  const [focused, setFocused] = useState(false);
  const debouncedQ = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQ.length >= 2) {
      medicalAPI.getSuggestions(debouncedQ)
        .then((res: any) => setSuggestions(res))
        .catch(() => {});
    } else {
      setSuggestions({ diseases: [], medicines: [] });
    }
  }, [debouncedQ]);

  const allSuggestions = [
    ...suggestions.diseases.map((d: any) => ({ ...d, type: 'disease' })),
    ...suggestions.medicines.map((m: any) => ({ name: m.name, category: m.class, type: 'drug' })),
  ];

  return (
    <View className="mx-4 mb-4">
      <View className={`flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border ${
        focused ? 'border-teal-400' : 'border-gray-100'
      }`}>
        <Ionicons name="search" size={20} color={focused ? '#0D7377' : '#9CA3AF'} />
        <TextInput
          className="flex-1 ml-3 text-base text-gray-800"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={() => { onSubmit(query); setSuggestions({ diseases: [], medicines: [] }); }}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {focused && allSuggestions.length > 0 && (
        <View className="bg-white rounded-2xl shadow-lg mt-2 overflow-hidden border border-gray-100">
          <FlatList
            data={allSuggestions.slice(0, 8)}
            keyExtractor={(_, i) => i.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-50"
                onPress={() => {
                  setQuery(item.name);
                  setSuggestions({ diseases: [], medicines: [] });
                  onSelect?.(item);
                }}
              >
                <Text className="text-lg mr-3">
                  {item.type === 'disease' ? '🏥' : '💊'}
                </Text>
                <View>
                  <Text className="text-gray-800 font-medium">{item.name}</Text>
                  {item.common_name && (
                    <Text className="text-gray-400 text-xs">{item.common_name}</Text>
                  )}
                  <Text className="text-teal-600 text-xs">{item.category}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
