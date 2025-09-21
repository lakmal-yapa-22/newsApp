import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: { backgroundColor: "#F9FAFB" }, // light neutral bg
        animation: "slide_from_right",
        headerStyle: {
          backgroundColor: "#1E40AF", // deep blue header
         
       
        },
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "700",
          color: "#FFFFFF", // white text
        
        },
        headerTintColor: "#FFFFFF", // back button color
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Sign Up",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
