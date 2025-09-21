import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import {
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
} from '@/services/newsService';
import { NewsArticle } from '@/types/news';
import { confirmAlert, showAlert } from '@/utils/alert';

const categories: NewsArticle['category'][] = [
  'General',
  'Sports',
  'Business',
  'Tech',
  'Entertainment',
  'Local',
];
const languages: NewsArticle['language'][] = ['EN', 'SI', 'TA'];

export default function AddOrEditNewsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] =
    useState<NewsArticle['category']>('General');
  const [tagsInput, setTagsInput] = useState('');
  const [language, setLanguage] =
    useState<NewsArticle['language']>('EN');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getNewsById(id).then((a) => {
        if (!a) return;
        setTitle(a.title);
        setBody(a.body);
        setCategory(a.category);
        setTagsInput((a.tags ?? []).join(', '));
        setLanguage(a.language || 'EN');
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!title || !body) {
      showAlert('Error', 'Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const payload: Partial<NewsArticle> = {
        title,
        body,
        category,
        authorId: user?.uid || 'unknown',
        authorName:
          user?.displayName || user?.email || 'Anonymous',
        isPublished: true,
        tags,
        language,
      };
      if (isEdit && id) {
        await updateNews(id, payload as any);
        showAlert('Updated', 'Article updated successfully');
        router.replace(`/home/${id}`);
      } else {
        const newId = await createNews({
          ...(payload as Omit<
            NewsArticle,
            'id' | 'createdAt' | 'updatedAt'
          >),
          likesCount: 0,
          commentsCount: 0,
          viewsCount: 0,
          isFeatured: false,
          priority: 0,
        });
        showAlert('Published', 'Article created successfully');
        router.replace(`/home/${newId}`);
      }
    } catch (e: any) {
      showAlert('Error', e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    confirmAlert('Delete?', 'This cannot be undone.', async () => {
      try {
        await deleteNews(id);
        showAlert('Deleted', 'Article removed successfully');
        router.replace('/home');
      } catch (e: any) {
        showAlert('Error', e.message || 'Failed to delete');
      }
    });
  };

  return (
    <ScrollView className="flex-1 px-5 py-6 bg-white">
      {/* Title */}
      <Text className="mb-6 text-2xl font-extrabold text-gray-900">
        {isEdit ? 'Edit News' : 'Add News'}
      </Text>

      {/* Headline */}
      <TextInput
        placeholder="Headline"
        value={title}
        onChangeText={setTitle}
        className="px-3 py-2 mb-4 text-base bg-gray-50 rounded-lg border border-gray-300"
      />

      {/* Content */}
      <TextInput
        placeholder="Content"
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        className="px-3 py-2 mb-4 h-40 text-base bg-gray-50 rounded-lg border border-gray-300"
      />

      {/* Categories */}
      <View className="flex-row flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setCategory(c)}
            className={`px-4 py-2 rounded-full border ${
              category === c
                ? 'bg-red-600 border-red-600'
                : 'bg-white border-gray-300'
            }`}
          >
            <Text
              className={
                category === c ? 'text-white' : 'text-gray-700'
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
        className="px-3 py-2 mb-4 text-base bg-gray-50 rounded-lg border border-gray-300"
      />

      {/* Languages */}
      <View className="flex-row flex-wrap gap-2 mb-6">
        {languages.map((l) => (
          <TouchableOpacity
            key={l}
            onPress={() => setLanguage(l)}
            className={`px-4 py-2 rounded-full border ${
              language === l
                ? 'bg-red-600 border-red-600'
                : 'bg-white border-gray-300'
            }`}
          >
            <Text
              className={
                language === l ? 'text-white' : 'text-gray-700'
              }
            >
              {l}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={saving}
        className={`py-3 rounded-xl ${
          saving ? 'bg-gray-400' : 'bg-red-600'
        }`}
      >
        <Text className="text-lg font-bold text-center text-white">
          {saving
            ? 'Saving...'
            : isEdit
            ? 'Update Article'
            : 'Publish Article'}
        </Text>
      </TouchableOpacity>

      {/* Delete */}
      {isEdit && (
        <TouchableOpacity
          onPress={handleDelete}
          className="py-3 mt-4 bg-gray-100 rounded-xl border border-gray-300"
        >
          <Text className="text-lg font-bold text-center text-red-600">
            Delete Article
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
