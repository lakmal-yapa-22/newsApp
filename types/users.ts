// types/users.ts
export interface RegisterForm {
  name: string;
  email: string;
  password: string;     // ❗️Only for form; DO NOT store
  location: string;
}

export interface UserProfile {
  uid: string;          // Firebase uid
  name: string;
  email: string;
  location: string;
  createdAt: number;
  updatedAt: number;
}
