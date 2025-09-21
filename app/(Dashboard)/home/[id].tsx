import {
  ArrowLeft, Heart, Share2, User, Pencil, Trash2
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert, ScrollView, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NewsArticle } from "@/types/news";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getNewsById, toggleLike, hasUserLiked, deleteNews
} from "@/services/newsService";
import {
  addComment, getComments, updateComment, deleteComment
} from "@/services/commentService";
import { useAuth } from "@/context/authContext";
import { useIsFocused } from "@react-navigation/native";

type Comment = {
  id: string;
  userId: string;
  authorName: string;
  text: string;
  createdAt: number;
};

const NewsDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [liked, setLiked] = useState(false);
  const [comments, setCommentsState] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const load = async () => {
    if (!id) return;
    const a = await getNewsById(id);
    if (!a) {
      Alert.alert("Not found");
      router.replace("/home");
      return;
    }
    setArticle(a);
    if (user?.uid) setLiked(await hasUserLiked(a.id!, user.uid));
    const list = await getComments(a.id!);
    setCommentsState(list as any);
  };

  useEffect(() => {
    if (isFocused) load();
  }, [id, user?.uid, isFocused]);

  const canEditNews = user?.uid && article?.authorId === user.uid;

  const onToggleLike = async () => {
    if (!user || !article) return;
    const res = await toggleLike(article.id!, user.uid);
    setLiked(res);
    await load();
  };

  const onAddComment = async () => {
    if (!user || !article || !newComment.trim()) return;
    await addComment(
      article.id!,
      user.uid,
      user.displayName || user.email || "Anonymous",
      newComment.trim()
    );
    setNewComment("");
    const list = await getComments(article.id!);
    setCommentsState(list as any);
  };

  const startEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditingText(c.text);
  };

  const saveEdit = async () => {
    if (!article || !editingId || !editingText.trim()) return;
    await updateComment(article.id!, editingId, editingText.trim());
    setEditingId(null);
    setEditingText("");
    const list = await getComments(article.id!);
    setCommentsState(list as any);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const onDeleteComment = async (cid: string) => {
    if (!article) return;
    Alert.alert("Delete comment?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteComment(article.id!, cid);
          const list = await getComments(article.id!);
          setCommentsState(list as any);
        },
      },
    ]);
  };

  const onDeleteNews = async () => {
    if (!article) return;
    Alert.alert("Delete article?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteNews(article.id!);
          Alert.alert("Deleted", "Article removed");
          router.replace("/home");
        },
      },
    ]);
  };

  if (!article) return <Text className="p-4">Loading...</Text>;

  return (
    <View className="flex-1 bg-white">
      {/* Gradient Header */}
      <LinearGradient
        colors={["#1E40AF", "#3B82F6"]}
        className="flex-row justify-between items-center px-4 pt-12 pb-4"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-row gap-3">
          {canEditNews && (
            <>
              <TouchableOpacity
                className="p-2 rounded-full bg-white/20"
                onPress={() =>
                  router.push({ pathname: "/news", params: { id: article.id! } })
                }
              >
                <Pencil size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 rounded-full bg-white/20"
                onPress={onDeleteNews}
              >
                <Trash2 size={22} color="white" />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            className="p-2 rounded-full bg-white/20"
            onPress={onToggleLike}
          >
            <Heart size={22} color="white" fill={liked ? "#ef4444" : "none"} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 rounded-full bg-white/20">
            <Share2 size={22} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-6">
        <View className="p-5 mb-6 bg-white rounded-2xl shadow-md">
          <Text className="mb-2 text-2xl font-bold text-gray-900">
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
          <View className="flex-row justify-around pt-4 border-t">
            <Text className="text-gray-600">❤️ {article.likesCount}</Text>
            <Text className="text-gray-600">💬 {article.commentsCount}</Text>
            <Text className="text-gray-600">👀 {article.viewsCount}</Text>
          </View>
        </View>

        {/* Comments */}
        <Text className="mb-3 text-lg font-semibold">Comments</Text>

        {user && (
          <View className="mb-6">
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write a comment..."
              className="p-3 mb-2 bg-gray-100 rounded-xl border border-gray-300"
              multiline
            />
            <TouchableOpacity
              onPress={onAddComment}
              className="py-3 bg-red-600 rounded-xl"
            >
              <Text className="font-semibold text-center text-white">
                Post Comment
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {comments.map((c) => {
          const mine = user?.uid === c.userId;
          const editing = editingId === c.id;

          return (
            <View
              key={c.id}
              className="p-4 mb-3 bg-gray-50 rounded-xl border shadow-sm"
            >
              <Text className="mb-1 font-semibold text-gray-900">
                {c.authorName}
              </Text>

              {editing ? (
                <>
                  <TextInput
                    value={editingText}
                    onChangeText={setEditingText}
                    className="p-3 mb-2 bg-white rounded-xl border border-gray-300"
                    multiline
                  />
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={saveEdit}
                      className="px-4 py-2 bg-red-600 rounded-lg"
                    >
                      <Text className="text-white">Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={cancelEdit}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      <Text className="text-gray-800">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text className="text-gray-800">{c.text}</Text>
              )}

              {mine && !editing && (
                <View className="flex-row gap-4 mt-2">
                  <TouchableOpacity onPress={() => startEdit(c)}>
                    <Text className="font-medium text-blue-600">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDeleteComment(c.id)}>
                    <Text className="font-medium text-red-600">Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default NewsDetails;
