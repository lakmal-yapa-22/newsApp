import React from "react";
import { Stack } from "expo-router";

const NewsLayout = () => (
  <Stack screenOptions={{ animation: "slide_from_right" }}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
  </Stack>
);

export default NewsLayout;
