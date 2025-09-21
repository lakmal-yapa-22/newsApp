import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import {
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "@/services/newsService";
import { NewsArticle } from "@/types/news";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";

const categories: NewsArticle["category"][] = [
  "General",
  "Sports",
  "Business",
  "Tech",
  "Entertainment",
  "Local",
];
const languages: NewsArticle["language"][] = ["EN", "SI", "TA"];

const AddOrEditNewsScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] =
    useState<NewsArticle["category"]>("General");
  const [tagsInput, setTagsInput] = useState("");
  const [language, setLanguage] =
    useState<NewsArticle["language"]>("EN");
  const [saving, setSaving] = useState(false);

  // 🔄 Load article in edit mode
  useEffect(() => {
    if (isEdit && id) {
      getNewsById(id).then((a) => {
        if (!a) return;
        setTitle(a.title);
        setBody(a.body);
        setCategory(a.category);
        setTagsInput((a.tags ?? []).join(", "));
        setLanguage(a.language || "EN");
      });
    }
  }, [id]);

  // ✅ Submit
  const handleSubmit = async () => {
    if (!title || !body) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<NewsArticle> = {
        title,
        body,
        category,
        authorId: user?.uid || "unknown",
        authorName: user?.displayName || user?.email || "Anonymous",
        isPublished: true,
        tags,
        language,
      };

      if (isEdit && id) {
        // 🔄 Update
        await updateNews(id, payload as any);
        Alert.alert("Updated", "Article updated successfully");
        router.replace(`/home/${id}`); // 👉 go to updated news
      } else {
        // 🆕 Create
        await createNews({
          ...(payload as Omit<
            NewsArticle,
            "id" | "createdAt" | "updatedAt"
          >),
          likesCount: 0,
          commentsCount: 0,
          viewsCount: 0,
          isFeatured: false,
          priority: 0,
        });
        Alert.alert("Published", "Article created successfully");
        router.back(); // 👉 go back, Home auto-refresh
      }
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // 🗑 Delete
  const handleDelete = async () => {
    if (!id) return;
    Alert.alert("Delete?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteNews(id);
            Alert.alert("Deleted", "Article removed successfully");
            router.replace("/home");
          } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to delete");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      {/* 🌈 Gradient Header */}
      <LinearGradient
        colors={["#1E40AF", "#3B82F6"]}
        className="flex-row justify-between items-center px-6 pt-12 pb-6 rounded-b-3xl"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-white/20"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-white">
          {isEdit ? "Edit Article" : "Add New Article"}
        </Text>
        <View className="w-8" /> {/* spacer */}
      </LinearGradient>

      {/* 📜 Form */}
      <ScrollView
        className="flex-1 px-6 py-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <TextInput
          placeholder="Headline"
          value={title}
          onChangeText={setTitle}
          className="p-4 mb-5 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm"
        />

        {/* Body */}
        <TextInput
          placeholder="Content"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          className="p-4 mb-5 h-44 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm"
        />

        {/* Category */}
        <Text className="mb-2 font-semibold text-gray-700">Category</Text>
        <View className="flex-row flex-wrap gap-2 mb-5">
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              className={`px-4 py-2 rounded-full border shadow-sm ${
                category === c
                  ? "bg-red-600 border-red-600"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={
                  category === c ? "text-white font-medium" : "text-gray-700"
                }
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tags */}
        <TextInput
          placeholder="Tags (comma separated)"
          value={tagsInput}
          onChangeText={setTagsInput}
          className="p-4 mb-5 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm"
        />

        {/* Language */}
        <Text className="mb-2 font-semibold text-gray-700">Language</Text>
        <View className="flex-row flex-wrap gap-2 mb-8">
          {languages.map((l) => (
            <TouchableOpacity
              key={l}
              onPress={() => setLanguage(l)}
              className={`px-4 py-2 rounded-full border shadow-sm ${
                language === l
                  ? "bg-red-600 border-red-600"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={
                  language === l ? "text-white font-medium" : "text-gray-700"
                }
              >
                {l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={saving}
          className="overflow-hidden mb-5 rounded-2xl shadow-md"
        >
          <LinearGradient
            colors={
              saving ? ["#9CA3AF", "#9CA3AF"] : ["#EF4444", "#DC2626"]
            }
            className="py-4"
          >
            <Text className="text-lg font-bold text-center text-white">
              {saving
                ? "Saving..."
                : isEdit
                ? "Update Article"
                : "Publish Article"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Delete in edit mode */}
        {isEdit && (
          <TouchableOpacity
            onPress={handleDelete}
            className="py-4 bg-gray-100 rounded-2xl border border-gray-300 shadow-sm"
          >
            <Text className="text-lg font-bold text-center text-red-600">
              Delete Article
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default AddOrEditNewsScreen;
