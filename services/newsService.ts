import { db } from '@/firebase';
import { NewsArticle } from '@/types/news';
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  orderBy, query, updateDoc, increment, setDoc
} from 'firebase/firestore';

export const newsRef = collection(db, 'news');

export const createNews = async (
  article: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>
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

export const updateNews = async (id: string, article: Partial<NewsArticle>) => {
  const ref = doc(db, 'news', id);
  await updateDoc(ref, { ...article, updatedAt: Date.now() } as any);
};

export const deleteNews = async (id: string) => {
  await deleteDoc(doc(db, 'news', id));
};

export const getNewsById = async (id: string): Promise<NewsArticle | null> => {
  const ref = doc(db, 'news', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const d = snap.data() as Partial<NewsArticle>;
  const a: NewsArticle = {
    id: snap.id,
    title: d.title || '',
    body: d.body || '',
    category: (d.category as any) || 'General',
    authorId: d.authorId || 'unknown',
    authorName: d.authorName || 'Anonymous',
    createdAt: d.createdAt || Date.now(),
    updatedAt: d.updatedAt || Date.now(),
    isPublished: d.isPublished ?? true,
    location: d.location,
    tags: d.tags ?? [],
    likesCount: d.likesCount ?? 0,
    commentsCount: d.commentsCount ?? 0,
    viewsCount: d.viewsCount ?? 0,
    isFeatured: d.isFeatured ?? false,
    priority: d.priority ?? 0,
    language: d.language ?? 'EN',
  };

  await updateDoc(ref, { viewsCount: increment(1) });
  return a;
};

export const getNewsList = async (): Promise<NewsArticle[]> => {
  const q = query(newsRef, orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as NewsArticle[];
};

export const toggleLike = async (newsId: string, userId: string) => {
  const likeRef = doc(db, 'news', newsId, 'likes', userId);
  const snap = await getDoc(likeRef);
  if (snap.exists()) {
    await deleteDoc(likeRef);
    await updateDoc(doc(db, 'news', newsId), { likesCount: increment(-1) });
    return false;
  }
  await setDoc(likeRef, { userId, createdAt: Date.now() });
  await updateDoc(doc(db, 'news', newsId), { likesCount: increment(1) });
  return true;
};

export const hasUserLiked = async (newsId: string, userId: string) => {
  const likeRef = doc(db, 'news', newsId, 'likes', userId);
  const snap = await getDoc(likeRef);
  return snap.exists();
};
