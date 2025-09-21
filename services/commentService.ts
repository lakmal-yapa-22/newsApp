import { db } from '@/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, increment } from 'firebase/firestore';

export const addComment = async (newsId: string, userId: string, authorName: string, text: string) => {
  const commentsRef = collection(db, 'news', newsId, 'comments');
  await addDoc(commentsRef, { userId, authorName, text, createdAt: Date.now() });
  await updateDoc(doc(db, 'news', newsId), { commentsCount: increment(1) });
};

export const getComments = async (newsId: string) => {
  const commentsRef = collection(db, 'news', newsId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'asc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
};

export const updateComment = async (newsId: string, commentId: string, text: string) => {
  await updateDoc(doc(db, 'news', newsId, 'comments', commentId), { text });
};

export const deleteComment = async (newsId: string, commentId: string) => {
  await deleteDoc(doc(db, 'news', newsId, 'comments', commentId));
  await updateDoc(doc(db, 'news', newsId), { commentsCount: increment(-1) });
};
