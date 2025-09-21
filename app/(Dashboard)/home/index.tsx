import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Newspaper, Search, LogOut } from 'lucide-react-native';
import { getNewsList } from '@/services/newsService';
import { useRouter } from 'expo-router';
import { NewsArticle } from '@/types/news';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/authContext';

export default function Home() {
  const [q, setQ] = useState('');
  const [list, setList] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout, user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        setLoading(true);
        const l = await getNewsList();
        setList(l);
        setLoading(false);
      })();
    }, [])
  );

  const filtered = list.filter(
    (a) =>
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      a.authorName.toLowerCase().includes(q.toLowerCase()) ||
      (a.tags || []).some((t) => t.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 pt-12 bg-white shadow-md">
        <View className="flex-row items-center">
          <Newspaper color="#dc2626" size={26} />
          <Text className="ml-2 text-2xl font-extrabold text-red-600">
            NewsNow
          </Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            await logout();
            router.replace('/login');
          }}
          className="p-2 bg-red-600 rounded-full"
        >
          <LogOut color="white" size={22} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="p-4">
        <View className="flex-row items-center px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
          <Search color="#6b7280" size={20} />
          <TextInput
            placeholder="Search news..."
            value={q}
            onChangeText={setQ}
            className="flex-1 ml-2 text-gray-700"
          />
        </View>
      </View>

      {/* News List */}
      <ScrollView className="flex-1 px-4">
        {loading ? (
          <ActivityIndicator size="large" color="#dc2626" className="mt-10" />
        ) : filtered.length === 0 ? (
          <Text className="mt-6 text-center text-gray-600">
            No articles found
          </Text>
        ) : (
          filtered.map((a) => (
            <TouchableOpacity
              key={a.id}
              onPress={() => router.push(`/home/${a.id}`)}
              className="p-4 mb-4 bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <Text className="text-lg font-bold text-gray-900">{a.title}</Text>
              <Text numberOfLines={2} className="mt-1 text-gray-600">
                {a.body}
              </Text>
              <View className="flex-row gap-4 mt-3">
                <Text className="text-sm text-gray-500">❤️ {a.likesCount}</Text>
                <Text className="text-sm text-gray-500">💬 {a.commentsCount}</Text>
                <Text className="text-sm text-gray-500">👀 {a.viewsCount}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
