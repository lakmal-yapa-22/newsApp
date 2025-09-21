import React from 'react';
import { Stack } from 'expo-router';
import '../global.css';
import { AuthProvider } from '@/context/authContext';
import { LoaderProvider } from '@/context/LoaderContext';

export default function RootLayout(){
  return (
    <AuthProvider>
      <LoaderProvider>
        <Stack screenOptions={{ headerShown:false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(Dashboard)" />
        </Stack>
      </LoaderProvider>
    </AuthProvider>
  );
}
