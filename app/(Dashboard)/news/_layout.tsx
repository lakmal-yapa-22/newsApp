import React from 'react';
import { Stack } from 'expo-router';
export default function NewsLayout(){
  return (
    <Stack screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen name="index" options={{ headerShown:false }} />
    </Stack>
  );
}
