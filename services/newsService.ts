import { db } from "@/firebase";
import { NewsArticle } from "@/types/news";
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  orderBy, query, updateDoc, increment, setDoc
} from "firebase/firestore";

export const newsRef = collection(db, "news");

/** Create */
export const createNews = async (
  article: Omit<NewsArticle, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const payload: NewsArticle = {
    ...article,
    tags: article.tags ?? [],
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    isFeatured: article.isFeatured ?? false,
    priority: article.priority ?? 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const ref = await addDoc(newsRef, payload as any);
  return ref.id;
};

/** Update */
export const updateNews = async (id: string, article: Partial<NewsArticle>) => {
  const ref = doc(db, "news", id);
  await updateDoc(ref, { ...article, updatedAt: Date.now() } as any);
};

/** Delete */
export const deleteNews = async (id: string) => {
  await deleteDoc(doc(db, "news", id));
};

/** Get one (and bump views) */
export const getNewsById = async (id: string): Promise<NewsArticle | null> => {
  const ref = doc(db, "news", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as Partial<NewsArticle>;
  const article: NewsArticle = {
    id: snap.id,
    title: data.title || "",
    body: data.body || "",
    category: (data.category as NewsArticle["category"]) || "General",
    authorId: data.authorId || "unknown",
    authorName: data.authorName || "Anonymous",
    createdAt: data.createdAt || Date.now(),
    updatedAt: data.updatedAt || Date.now(),
    isPublished: data.isPublished ?? true,
    location: data.location,
    tags: data.tags ?? [],
    likesCount: data.likesCount ?? 0,
    commentsCount: data.commentsCount ?? 0,
    viewsCount: data.viewsCount ?? 0,
    isFeatured: data.isFeatured ?? false,
    priority: data.priority ?? 0,
    language: data.language ?? "EN",
  };

  // bump views
  await updateDoc(ref, { viewsCount: increment(1) });
  return article;
};

/** List (latest first) */
export const getNewsList = async (): Promise<NewsArticle[]> => {
  const q = query(newsRef, orderBy("createdAt", "desc"));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as NewsArticle[];
};

/** Like toggle */
export const toggleLike = async (newsId: string, userId: string) => {
  const likeRef = doc(db, "news", newsId, "likes", userId);
  const snap = await getDoc(likeRef);

  if (snap.exists()) {
    await deleteDoc(likeRef);
    await updateDoc(doc(db, "news", newsId), { likesCount: increment(-1) });
    return false;
  } else {
    await setDoc(likeRef, { userId, createdAt: Date.now() });
    await updateDoc(doc(db, "news", newsId), { likesCount: increment(1) });
    return true;
  }
};

export const hasUserLiked = async (newsId: string, userId: string) => {
  const likeRef = doc(db, "news", newsId, "likes", userId);
  const snap = await getDoc(likeRef);
  return snap.exists();
};
