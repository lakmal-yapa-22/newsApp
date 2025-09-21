import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useAuth } from "@/context/authContext";
import CustomTextField from "@/components/CustomTextField";
import { Eye, EyeOff } from "lucide-react-native";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    if (!name.trim() || !location.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      Alert.alert("Error", "Enter a valid email");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await register({ name, email, password, location });
      Alert.alert("Success", "Account created!");
      router.replace("/(Dashboard)/home");
    } catch (e: any) {
      const msg =
        e?.code === "auth/email-already-in-use"
          ? "Email already in use"
          : e?.code === "auth/invalid-email"
          ? "Invalid email"
          : e?.code === "auth/weak-password"
          ? "Weak password"
          : e?.message || "Registration failed";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-12">
          {/* Logo + Title */}
          <View className="items-center mb-8">
            <View className="justify-center items-center mb-3 w-16 h-16 bg-red-600 rounded-full shadow-md">
              <Text className="text-3xl font-extrabold text-white">N</Text>
            </View>
            <Text className="text-3xl font-extrabold text-gray-900">
              Create Account
            </Text>
          </View>

          {/* Fields */}
          <CustomTextField
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
          <CustomTextField
            label="Location"
            placeholder="e.g., Colombo"
            value={location}
            onChangeText={setLocation}
          />
          <CustomTextField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password */}
          <View className="mt-2">
            <Text className="mb-1 text-sm text-gray-600">Password</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl border border-gray-200">
              <CustomTextField
                label=""
                placeholder="Enter password"
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

          {/* Confirm Password */}
          <View className="mt-4">
            <Text className="mb-1 text-sm text-gray-600">Confirm Password</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl border border-gray-200">
              <CustomTextField
                label=""
                placeholder="Re-enter password"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showConfirm}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                className="absolute right-2 top-3 p-3"
              >
                {showConfirm ? (
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
              {loading ? "Creating..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* Login link */}
          <Text className="mt-4 mb-8 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/(auth)/login" className="font-semibold text-red-600">
              Login
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
