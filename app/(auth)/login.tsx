import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useAuth } from "@/context/authContext";
import { Eye, EyeOff } from "lucide-react-native";
import CustomTextField from "@/components/CustomTextField";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter email and password");
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      router.replace("/(Dashboard)/home");
    } catch (e: any) {
      const msg =
        e?.code === "auth/invalid-credential"
          ? "Invalid email/password"
          : e?.message || "Login failed";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 justify-center px-6 bg-white"
    >
      {/* Logo + Title */}
      <View className="items-center mb-10">
        <View className="justify-center items-center mb-3 w-16 h-16 bg-red-600 rounded-full shadow-md">
          <Text className="text-3xl font-extrabold text-white">N</Text>
        </View>
        <Text className="text-3xl font-extrabold text-gray-900">News</Text>
      </View>

      {/* Email */}
      <CustomTextField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password with toggle */}
      <View>
        <Text className="mb-1 text-sm text-gray-600">Password</Text>
        <View className="flex-row items-center bg-gray-100 rounded-xl border border-gray-200">
          <CustomTextField
            label=""
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-3 p-3"
          >
            {showPassword ? (
              <EyeOff size={20} color="gray" />
            ) : (
              <Eye size={20} color="gray" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={onSubmit}
        disabled={loading}
        className={`p-4 rounded-xl mt-6 ${
          loading ? "bg-gray-400" : "bg-red-600"
        }`}
      >
        <Text className="text-lg font-semibold text-center text-white">
          {loading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* Register link */}
      <Text className="mt-4 text-center text-gray-600">
        Don’t have an account?{" "}
        <Link href="/(auth)/register" className="font-semibold text-red-600">
          Sign up
        </Link>
      </Text>
    </KeyboardAvoidingView>
  );
}
