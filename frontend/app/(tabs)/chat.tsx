/**
 * AI Chat Screen
 */
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { streamChat } from '../../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const STARTERS = [
  { text: "What foods should a diabetic avoid?", emoji: "🩸" },
  { text: "Is Metformin safe during pregnancy?", emoji: "🤰" },
  { text: "What are signs of high blood pressure?", emoji: "❤️" },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput('');
    setSending(true);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg };
    const aiId = (Date.now() + 1).toString();
    const aiMsg: Message = { id: aiId, role: 'assistant', content: '' };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const reader = await streamChat({ message: msg, history });
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw = decoder.decode(value);
        for (const line of raw.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const chunk = line.slice(6);
          if (chunk === '[DONE]') break;

          setMessages(prev => prev.map(m =>
            m.id === aiId ? { ...m, content: m.content + chunk } : m
          ));
        }
        listRef.current?.scrollToEnd({ animated: false });
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === aiId
          ? { ...m, content: 'Sorry, I could not respond. Please try again.' }
          : m
      ));
    } finally {
      setSending(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }

  function renderMessage({ item: msg }: { item: Message }) {
    const isUser = msg.role === 'user';
    return (
      <View className={`px-4 mb-3 ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <View className="flex-row items-center mb-1 ml-1">
            <Text className="text-sm">🤖</Text>
            <Text className="text-gray-400 text-xs ml-1">MedAI</Text>
          </View>
        )}
        <View className={`max-w-[85%] rounded-3xl px-4 py-3 ${
          isUser ? 'bg-teal-600 rounded-tr-sm' : 'bg-white rounded-tl-sm shadow-sm'
        }`}>
          <Text className={`text-sm leading-6 ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {msg.content}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={['#D97706','#F59E0B']} className="px-4 pt-3 pb-4">
        <Text className="text-white text-xl font-bold">🤖 AI Medical Chat</Text>
        <Text className="text-amber-100 text-xs mt-1">
          Powered by Meditron 70B · For information only
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {messages.length === 0 && (
          <View className="p-4">
            <Text className="text-gray-500 text-sm font-medium mb-3">
              💡 Try asking:
            </Text>
            {STARTERS.map((s, i) => (
              <TouchableOpacity key={i}
                onPress={() => send(s.text)}
                className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-2 border border-gray-100">
                <Text className="text-xl mr-3">{s.emoji}</Text>
                <Text className="text-gray-700 text-sm flex-1">{s.text}</Text>
                <Ionicons name="arrow-forward" size={16} color="#D97706" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        />

        <View className="px-4 py-3 bg-white border-t border-gray-100 flex-row items-end gap-3">
          <TextInput
            className="flex-1 bg-gray-50 rounded-3xl px-4 py-3 text-gray-800 max-h-24 border border-gray-100"
            placeholder="Ask a health question..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            onPress={() => send()}
            disabled={sending || !input.trim()}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              input.trim() ? 'bg-amber-500' : 'bg-gray-200'
            }`}
          >
            {sending
              ? <ActivityIndicator size="small" color="white" />
              : <Ionicons name="send" size={20} color={input.trim() ? 'white' : '#9CA3AF'} />
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
