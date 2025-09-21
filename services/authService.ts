// services/authService.ts
import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { RegisterForm, UserProfile } from "@/types/users";

const usersRef = collection(db, "users");

export async function registerAndCreateProfile(form: RegisterForm) {
  // 1) create auth user
  const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);

  // 2) update displayName (so app can show author's name)
  await updateProfile(cred.user, { displayName: form.name });

  // 3) save public profile in Firestore (❌ no password!)
  const profile: UserProfile = {
    uid: cred.user.uid,
    name: form.name,
    email: form.email,
    location: form.location,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await setDoc(doc(usersRef, cred.user.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return cred.user;
}

export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);
