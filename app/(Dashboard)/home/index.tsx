import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator
} from "react-native";
import { Newspaper, Search } from "lucide-react-native";
import { getNewsList } from "@/services/newsService";
import { useRouter } from "expo-router";
import { NewsArticle } from "@/types/news";
import { useFocusEffect } from "@react-navigation/native";

const Home = () => {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Refresh on focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchArticles = async () => {
        setLoading(true);
        const list = await getNewsList();
        setArticles(list);
        setLoading(false);
      };
      fetchArticles();
    }, [])
  );

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.authorName.toLowerCase().includes(query.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 pt-12 bg-black">
        <Newspaper color="white" size={24} />
        <Text className="ml-2 text-2xl font-extrabold text-white">NewsNow</Text>
      </View>

      {/* Search */}
      <View className="p-4 bg-black">
        <View className="flex-row items-center px-4 py-3 bg-white rounded-full">
          <Search color="#6b7280" size={20} />
          <TextInput
            placeholder="Search news..."
            value={query}
            onChangeText={setQuery}
            className="flex-1 ml-3 text-gray-700"
          />
        </View>
      </View>

      {/* List */}
      <ScrollView className="flex-1 p-4">
        {loading ? (
          <ActivityIndicator size="large" color="#dc2626" />
        ) : filtered.length === 0 ? (
          <Text className="text-gray-600">No articles found</Text>
        ) : (
          filtered.map((a) => (
            <TouchableOpacity
              key={a.id}
              onPress={() => router.push(`/home/${a.id}`)}
              className="p-4 mb-4 bg-white rounded-xl border shadow-sm"
            >
              <Text className="text-lg font-bold">{a.title}</Text>
              <Text numberOfLines={2} className="text-gray-600">
                {a.body}
              </Text>
              <View className="flex-row gap-4 mt-2">
                <Text>❤️ {a.likesCount}</Text>
                <Text>💬 {a.commentsCount}</Text>
                <Text>👀 {a.viewsCount}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
