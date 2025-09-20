import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import {
  createNews, getNewsById, updateNews, deleteNews
} from "@/services/newsService";
import { NewsArticle } from "@/types/news";

const categories: NewsArticle["category"][] = [
  "General","Sports","Business","Tech","Entertainment","Local",
];
const languages: NewsArticle["language"][] = ["EN","SI","TA"];

const AddOrEditNewsScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<NewsArticle["category"]>("General");
  const [tagsInput, setTagsInput] = useState("");
  const [language, setLanguage] = useState<NewsArticle["language"]>("EN");
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async () => {
    if (!title || !body) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

      const payload: Partial<NewsArticle> = {
        title, body, category,
        authorId: user?.uid || "unknown",
        authorName: user?.displayName || user?.email || "Anonymous",
        isPublished: true,
        tags, language,
      };

      if (isEdit && id) {
        await updateNews(id, payload as any);
        Alert.alert("Updated", "Article updated successfully");
        router.replace(`/home/${id}`);
      } else {
        const newId = await createNews({
          ...(payload as Omit<NewsArticle,"id"|"createdAt"|"updatedAt">),
          likesCount: 0,
          commentsCount: 0,
          viewsCount: 0,
          isFeatured: false,
          priority: 0,
        });
        Alert.alert("Published", "Article created successfully");
        router.replace(`/home/${newId}`);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

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
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="mb-4 text-2xl font-bold">
        {isEdit ? "Edit News" : "Add News"}
      </Text>

      <TextInput
        placeholder="Headline"
        value={title}
        onChangeText={setTitle}
        className="p-4 mb-4 bg-gray-50 rounded-xl border border-gray-300"
      />

      <TextInput
        placeholder="Content"
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        className="p-4 mb-4 h-40 bg-gray-50 rounded-xl border border-gray-300"
      />

      <View className="flex-row flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setCategory(c)}
            className={`px-3 py-2 rounded-lg border ${
              category === c ? "bg-red-600 border-red-600" : "bg-white border-gray-300"
            }`}
          >
            <Text className={category === c ? "text-white" : "text-gray-700"}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Tags (comma separated)"
        value={tagsInput}
        onChangeText={setTagsInput}
        className="p-4 mb-4 bg-gray-50 rounded-xl border border-gray-300"
      />

      <View className="flex-row flex-wrap gap-2 mb-6">
        {languages.map((l) => (
          <TouchableOpacity
            key={l}
            onPress={() => setLanguage(l)}
            className={`px-3 py-2 rounded-lg border ${
              language === l ? "bg-red-600 border-red-600" : "bg-white border-gray-300"
            }`}
          >
            <Text className={language === l ? "text-white" : "text-gray-700"}>
              {l}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={saving}
        className={`py-4 rounded-xl ${saving ? "bg-gray-400" : "bg-red-600"}`}
      >
        <Text className="text-lg font-bold text-center text-white">
          {saving ? "Saving..." : isEdit ? "Update Article" : "Publish Article"}
        </Text>
      </TouchableOpacity>

      {/* Delete in edit mode */}
      {isEdit && (
        <TouchableOpacity
          onPress={handleDelete}
          className="py-4 mt-4 bg-gray-200 rounded-xl"
        >
          <Text className="text-lg font-bold text-center text-red-600">
            Delete Article
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default AddOrEditNewsScreen;
