import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Newspaper, Search, LogOut } from "lucide-react-native";
import { getNewsList } from "@/services/newsService";
import { useRouter } from "expo-router";
import { NewsArticle } from "@/types/news";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/authContext";

const Home = () => {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout, user } = useAuth();

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

  // ✅ Safe search
  const filtered = query.trim()
    ? articles.filter(
        (a) =>
          a.title?.toLowerCase().includes(query.toLowerCase()) ||
          a.authorName?.toLowerCase().includes(query.toLowerCase()) ||
          (a.tags?.some((t) =>
            t.toLowerCase().includes(query.toLowerCase())
          ) ?? false)
      )
    : articles;

  const handleLogout = async () => {
  Alert.alert("Logout", "Are you sure you want to log out?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        await logout();        // Firebase signOut
        router.replace("/login"); // ✅ absolute path
      },
    },
  ]);
};


  return (
    <View className="flex-1 bg-white">
      {/* Gradient Header */}
      <LinearGradient
        colors={["#1E40AF", "#3B82F6"]}
        className="flex-row justify-between items-center px-4 pt-12 pb-4"
      >
        <View className="flex-row items-center">
          <Newspaper color="white" size={28} />
          <Text className="ml-2 text-2xl font-extrabold text-white">
            NewsNow
          </Text>
        </View>

        {user && (
          <TouchableOpacity
            onPress={handleLogout}
            className="p-2 rounded-full bg-white/20"
          >
            <LogOut size={22} color="white" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Search */}
      <View className="p-4 bg-white">
        <View className="flex-row items-center px-4 py-3 bg-gray-50 rounded-full border border-gray-200 shadow-sm">
          <Search color="#6b7280" size={20} />
          <TextInput
            placeholder="Search news..."
            value={query}
            onChangeText={setQuery}
            className="flex-1 ml-3 text-gray-700"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* List */}
      <ScrollView className="flex-1 px-4">
        {loading ? (
          <View className="items-center mt-10">
            <ActivityIndicator size="large" color="#dc2626" />
            <Text className="mt-2 text-gray-500">Loading articles...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="items-center mt-10">
            <Text className="font-medium text-gray-600">
              No articles found 😢
            </Text>
          </View>
        ) : (
          filtered.map((a) => (
            <TouchableOpacity
              key={a.id}
              onPress={() => router.push(`/home/${a.id}`)}
              className="p-5 mb-4 bg-white rounded-2xl border border-gray-200 shadow-md"
            >
              <Text className="mb-1 text-lg font-bold text-gray-900">
                {a.title}
              </Text>
              <Text numberOfLines={2} className="text-gray-600">
                {a.body}
              </Text>
              <View className="flex-row gap-6 mt-3">
                <Text className="text-gray-700">❤️ {a.likesCount}</Text>
                <Text className="text-gray-700">💬 {a.commentsCount}</Text>
                <Text className="text-gray-700">👀 {a.viewsCount}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
