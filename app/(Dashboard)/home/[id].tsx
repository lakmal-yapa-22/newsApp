import {
  ArrowLeft,
  Heart,
 
  User,
  Pencil,
  Trash2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NewsArticle } from "@/types/news";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getNewsById,
  toggleLike,
  hasUserLiked,
  deleteNews,
} from "@/services/newsService";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from "@/services/commentService";
import { useAuth } from "@/context/authContext";
import { useIsFocused } from "@react-navigation/native";
import { confirmAlert, showAlert } from "@/utils/alert";

type Comment = {
  id: string;
  userId: string;
  authorName: string;
  text: string;
  createdAt: number;
};

export default function NewsDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const load = async () => {
    if (!id) return;
    const a = await getNewsById(id);
    if (!a) {
      showAlert("Not found", "Article no longer exists");
      router.replace("/home");
      return;
    }
    setArticle(a);
    if (user?.uid) setLiked(await hasUserLiked(a.id!, user.uid));
    setComments(await getComments(a.id!));
  };

  useEffect(() => {
    if (isFocused) load();
  }, [id, user?.uid, isFocused]);

  const canEditNews = user?.uid && article?.authorId === user.uid;

  const onToggleLike = async () => {
    if (!user || !article) return;
    const r = await toggleLike(article.id!, user.uid);
    setLiked(r);
    await load();
  };

  const onAddComment = async () => {
    if (!user || !article || !newComment.trim()) return;
    await addComment(
      article.id!,
      user.uid,
      user.email || "Anonymous",
      newComment.trim()
    );
    setNewComment("");
    setComments(await getComments(article.id!));
  };

  const saveEdit = async () => {
    if (!article || !editingId || !editingText.trim()) return;
    await updateComment(article.id!, editingId, editingText.trim());
    setEditingId(null);
    setEditingText("");
    setComments(await getComments(article.id!));
  };

const onDeleteComment = async (cid: string) => {
  if (!article) return;
  await deleteComment(article.id!, cid);
  setComments(await getComments(article.id!));
};

const onDeleteNews = async () => {
  if (!article) return;
  await deleteNews(article.id!);
  router.replace("/home");
};


  if (!article) return <Text className="p-4">Loading...</Text>;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-12 pb-3 bg-white border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-gray-100 rounded-full"
        >
          <ArrowLeft size={22} color="#374151" />
        </TouchableOpacity>
        <View className="flex-row gap-3">
          {canEditNews && (
            <>
              <TouchableOpacity
                className="p-2 bg-gray-100 rounded-full"
                onPress={() =>
                  router.push({ pathname: "/news", params: { id: article.id! } })
                }
              >
                <Pencil size={20} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 bg-gray-100 rounded-full"
                onPress={onDeleteNews}
              >
                <Trash2 size={20} color="#dc2626" />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            className="p-2 bg-gray-100 rounded-full"
            onPress={onToggleLike}
          >
            <Heart
              size={20}
              color={liked ? "#ef4444" : "#374151"}
              fill={liked ? "#ef4444" : "none"}
            />
          </TouchableOpacity>
         
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5 py-6">
        <Text className="mb-2 text-2xl font-extrabold text-gray-900">
          {article.title}
        </Text>
        <View className="flex-row items-center mb-2">
          <User size={16} color="#6b7280" />
          <Text className="ml-2 font-medium text-gray-700">
            {article.authorName}
          </Text>
        </View>
        <Text className="mb-6 text-base leading-6 text-gray-700">
          {article.body}
        </Text>

        {/* Stats */}
        <View className="flex-row gap-6 mb-8">
          <Text className="text-gray-600">❤️ {article.likesCount}</Text>
          <Text className="text-gray-600">💬 {article.commentsCount}</Text>
          <Text className="text-gray-600">👀 {article.viewsCount}</Text>
        </View>

        {/* Comments */}
        <Text className="mb-3 text-lg font-semibold text-gray-900">
          Comments
        </Text>
        {user && (
          <View className="mb-6">
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write a comment..."
              className="px-3 py-2 mb-2 bg-gray-50 rounded-lg border border-gray-300"
              multiline
            />
            <TouchableOpacity
              onPress={onAddComment}
              className="py-3 bg-red-600 rounded-lg"
            >
              <Text className="font-semibold text-center text-white">
                Post Comment
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Comment List */}
        {comments.map((c) => {
          const mine = user?.uid === c.userId;
          const editing = editingId === c.id;
          return (
            <View
              key={c.id}
              className="p-4 mb-3 bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              {/* Author + Date */}
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <View className="justify-center items-center mr-2 w-8 h-8 bg-red-100 rounded-full">
                    <Text className="text-sm font-bold text-red-600">
                      {c.authorName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text className="font-semibold text-gray-900">
                    {c.authorName}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </Text>
              </View>

              {/* Body / Edit Mode */}
              {editing ? (
                <>
                  <TextInput
                    value={editingText}
                    onChangeText={setEditingText}
                    className="px-3 py-2 mb-2 bg-gray-50 rounded-lg border border-gray-300"
                    multiline
                  />
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={saveEdit}
                      className="px-4 py-2 bg-red-600 rounded-full"
                    >
                      <Text className="font-medium text-white">Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-full"
                    >
                      <Text className="font-medium text-gray-800">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text className="leading-5 text-gray-700">{c.text}</Text>
              )}

              {/* Actions */}
              {mine && !editing && (
                <View className="flex-row gap-6 mt-3">
                  <TouchableOpacity
                    onPress={() => {
                      setEditingId(c.id);
                      setEditingText(c.text);
                    }}
                  >
                    <Text className="text-sm font-semibold text-red-600">
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDeleteComment(c.id)}>
                    <Text className="text-sm font-semibold text-red-600">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
